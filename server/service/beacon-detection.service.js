/**
 * Service layer for beacon events
 */
'use strict';

var when = require('when');
var beaconDetectionDao = require('../dao/beacon-detection.dao.js');
var dateQueryParser = require('../utils/date.query.parser.js');
var _ = require('lodash');
var agentService = require('./agent.service.js');
var config = require('../config/environment');
var eventPublisherService = require('./event.publisher.service.js');

function findDetections(optionalFilters) {
    if (optionalFilters) {
        return when(beaconDetectionDao.findFilteredDetectionsPromise(optionalFilters));
    } else {
        return when(beaconDetectionDao.findAllDetectionsPromise());
    }
}

function findFilteredDetections(uuid, agentId, time) {
    var filters;
    if (uuid || agentId || time) {
        filters = {};

        if (uuid) {
            filters.uuid = uuid;
        }
        if (agentId) {
            filters.agentId = agentId;
        }
        if (time) {
            filters.time = dateQueryParser.convertQueryToMongoFilter(time);
        }
    }
    return findDetections(filters);
};

function findDetectionsByUuid(uuid) {
    var filters = {uuid: uuid};
    return findDetections(filters);
}

function findDetectionsByAgentId(agentId) {
    var filters = {agentId: agentId};
    return findDetections(filters);
}

function findDetectionsByDateRange(time) {
    var filters;
    if (time) {
        filters = {time: dateQueryParser.convertQueryToMongoFilter(time)};
    }
    return findDetections(filters);
}

/**
 * Create a single beacon detection
 *
 * @param beaconDetection
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetection(beaconDetection, timeAsMs) {
    beaconDetection.time = new Date()
    var promise = when(beaconDetectionDao.createDetectionPromise(beaconDetection));

    if (timeAsMs && timeAsMs === true) {
        var defer = when.defer();
        promise.then(function (savedDetection) {
            if (savedDetection.time) {
                savedDetection.time = savedDetection.time.getTime();
            }
            defer.resolve(savedDetection);
        })
        return defer.promise;

    } else {
        return promise;
    }
}

//function changeDetectionTimeStringToDate(detection) {
//    if (detection && detection.time && detection.time instanceof String) {
//        // convert to date
//        detection.time = moment.utc(detection.time).toDate();
//    }
//}

/**
 * Create an array of beacon detections.
 * Promise will contain an array of the saved detections.
 *
 * @param beaconDetections
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetections(beaconDetections, timeAsMs) {
//    beaconDetections.forEach(changeDetectionTimeStringToDate);

    var promise = when(beaconDetectionDao.createDetectionsPromise(beaconDetections));
    if (timeAsMs && timeAsMs === true) {
        var defer = when.defer();
        // convert dates to ms timestamps
        promise.then(function (detections) {
            var savedDetections = [];
            detections.forEach(function (savedDetection) {
                // flip the dates back to ms for consistency
                if (savedDetection.time) {
                    savedDetection.time = savedDetection.time.getTime();
                }
                savedDetections.push(savedDetection);
            });
            defer.resolve(savedDetections);
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    } else {
        return promise;
    }
}

/**
 *
 * @param beaconDetections
 * @returns {*} promise that all save attempts have completed.  Promise will
 * always be resolved so you need to check the response to see if there are any errors in it.
 */
function createDetectionsOneByOne(beaconDetections) {
    var savedDetections = [];
    var failures = [];

    var createPromises = [];
    beaconDetections.forEach(function (detection) {
        var promise = createDetection(detection);
        createPromises.push(promise);
    });

    var defer = when.defer();

    var settled = when.settle(createPromises);
    settled.then(function (descriptors) {
        descriptors.forEach(function (d) {
            if (d.state === 'rejected') {
                failures.push(d.reason);
            } else {
                savedDetections.push(d.value);
            }
        });
        defer.resolve({succeeded: savedDetections, failed: failures});
    });

    return defer.promise;
}

//exports.deleteAllDetections = function deleteAllDetections() {
//    return when(beaconDetectionDao.deleteAllDetections());
//}

//[Lindsay Thurmond:10/29/14] TODO: cleanup
var cache = {};

/**
 * Analyzes the detections to decide which types of events to publish.
 * Possible event types are:
 *  - enter - first time seen in a region
 *  - exit - first time no longer in a region
 *  - alive - in range but didn't just enter
 *
 * @param newDetections
 */
function processEventsFromDetections(newDetections) {

    // sort detections by agent
    var agentIdToDetections = _.groupBy(newDetections, function (detection) {
        return detection.agentId;
    });

    // remove any detections that didn't have an agent id specified
    delete agentIdToDetections.undefined;

    if (_.keys(agentIdToDetections).length > 0) {

        var foundAgentIds = [];

        // look up current beacons so we can check their range //[Lindsay Thurmond:11/4/14] TODO: ... look into caching these
        agentService.findAgents().
            then(function (fullAgentList) {

                var existingAgentMap = _.groupBy(fullAgentList, function (agent) {
                    return agent.customId;
                });

                _.forEach(agentIdToDetections, function (detections, agentId) {
                    if(_.indexOf(foundAgentIds, agentId) === -1) {
                        foundAgentIds.push(agentId);
                    }

                    if (!cache[agentId]) {
                        cache[agentId] = [];
                    }
                    var seenBeacons = cache[agentId];
                    var prevInRangeBeaconUniqueKeys = _.keys(seenBeacons);

                    var foundBeaconUniqueKeys = [];
                    detections.forEach(function (detection) {
                        var beaconUuid = detection.uuid;
                        var major = detection.major;
                        var minor = detection.minor;

                        // beacon detections with only an agentId and nothing else indicate all beacons left range of the agent
                        if (!beaconUuid || !major || !minor) {
                            // all beacons left range of the agent
                            prevInRangeBeaconUniqueKeys.forEach(function (uniqueKey) {
                                publishDetectionByUniqueKeyEvent(agentId, uniqueKey, 'exit');
                            });
                            cache[agentId] = [];

                        } else {

                            var uniqueKey = createBeaconUniqueKey(beaconUuid, major, minor);

                            if (_.indexOf(foundBeaconUniqueKeys, uniqueKey) === -1) {
                                foundBeaconUniqueKeys.push(uniqueKey);
                            }

                            var dbAgent = existingAgentMap[agentId];
                            var hasRangeSpecified = dbAgent && dbAgent[0] && dbAgent[0].range;

                            var currentBeacon = seenBeacons[uniqueKey];
                            // first time we've seen the beacon
                            if (!currentBeacon) {
                                if (!hasRangeSpecified || (hasRangeSpecified && detection.proximity <= dbAgent[0].range)) {
                                    // first time this agent has seen this beacon
                                    publishDetectionEvent(agentId, beaconUuid, major, minor, 'enter');

                                    // add beacon to cache so we know we've previously seen it
                                    currentBeacon = { time: detection.time, proximity: detection.proximity };
                                    seenBeacons[uniqueKey] = currentBeacon;
                                }  // else ignore it b/c its out of the range that we care about

                            }
                            // beacon was previously in range
                            else {
                                if (hasRangeSpecified) {
                                    if (detection.proximity <= dbAgent[0].range) {
                                        // broadcast that we are still alive
                                        publishDetectionEvent(agentId, beaconUuid, major, minor, 'alive');
                                    } else {
                                        delete seenBeacons[uniqueKey];
                                        // got a detection, but now out of range
                                        publishDetectionEvent(agentId, beaconUuid, major, minor, 'exit');
                                    }

                                } else {
                                    // broadcast that we are still alive
                                    publishDetectionEvent(agentId, beaconUuid, major, minor, 'alive');
                                }
                            }
                        }
                    });

                    // We've gone through all the detections for the agent
                    // Are there any beacons that we used to know about that we didn't get an update for?
                    var outOfRangeBeacons = _.difference(prevInRangeBeaconUniqueKeys, foundBeaconUniqueKeys);
                    if (outOfRangeBeacons.length > 0) {
                        // at least one beacon went out of range
                        // remove them from the cache
                        outOfRangeBeacons.forEach(function (beaconUniqueKey) {
                            delete seenBeacons[beaconUniqueKey];

                            // fire event that the beacon left range
                            publishDetectionByUniqueKeyEvent(agentId, beaconUniqueKey, 'exit');
                        });
                    }
                });

            }, function (err) {
                console.log(err);
            })
            .otherwise(function (err) {
                console.log(err);
            });
    }
}

function createBeaconUniqueKey(uuid, major, minor) {
    return uuid + ":" + major + ":" + minor;
}


var DETECTION_EVENT_TYPE = 'com.makeandbuild.detection';

function publishDetectionEvent(agentId, beaconUuid, beaconMajor, beaconMinor, eventType) {
    eventPublisherService.publishEvent(DETECTION_EVENT_TYPE, [agentId, beaconUuid, beaconMajor, beaconMinor, eventType]);
}

function publishDetectionByUniqueKeyEvent(agentId, beaconUniqueKey, eventType) {
    var parts = beaconUniqueKey.split(':');
    var beaconUuid = parts[0];
    var beaconMajor = parts[1];
    var beaconMinor = parts[2];

    eventPublisherService.publishEvent(DETECTION_EVENT_TYPE, [agentId, beaconUuid, beaconMajor, beaconMinor, eventType]);
}

function updateAgentsWithMostRecentDetectionPromise(detections) {
    // sort detections by agent
    var agentIdToDetections = _.groupBy(detections, function (detection) {
        return detection.agentId;
    });

    // remove any detections that didn't have an agent id specified
    delete agentIdToDetections.undefined;

    var promises = [];

    _.forEach(agentIdToDetections, function (allDetections, agentId) {
        // which detection is most recent for the agent?
        var mostRecentDetection = _.max(allDetections, function (detection) {
            return detection.time;
        });

        var defer = when.defer();

        // update agent with most recent detection if needed
        agentService.findAgentByCustomId(agentId)
            .then(function (foundAgent) {
                if (!foundAgent) {
                    defer.reject('Could not find agent with id = ' + agentId);
                    return;
                }

                // update agent with new heartbeat (time + id)
                if (mostRecentDetection.time > foundAgent.lastSeen) {

                    foundAgent.lastSeen = mostRecentDetection.time;
                    foundAgent.lastSeenBy = mostRecentDetection.uuid;

                    agentService.updateAgent(foundAgent)
                        .then(function (agent) {
                            defer.resolve(agent);
                        }, function (err) {
                            defer.reject(err);
                        });
                } else {
                    // nothing to update, just resolve the promise with original agent
                    defer.resolve(foundAgent);
                }
            });
        promises.push(defer.promise);
    });

    return when.settle(promises);
}


exports.findDetections = findDetections;
exports.findDetectionsByDateRange = findDetectionsByDateRange;
exports.findDetectionsByAgentId = findDetectionsByAgentId;
exports.findFilteredDetections = findFilteredDetections;
exports.findDetectionsByUuid = findDetectionsByUuid;
exports.createDetection = createDetection;
exports.createDetections = createDetections;
exports.createDetectionsOneByOne = createDetectionsOneByOne;
exports.updateAgentsWithMostRecentDetectionPromise = updateAgentsWithMostRecentDetectionPromise;
exports.processEventsFromDetections = processEventsFromDetections;