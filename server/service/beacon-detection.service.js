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

    if (_.keys(agentIdToDetections).length === 0) {
        // no detections, indicates that all beacons went out of range for all agents
        _.forOwn(cache, function (agent, agentId) {
            var beaconUuids = _.keys(agent);
            beaconUuids.forEach(function(uuid){
                publishDetectionEvent(agentId, uuid, 'exit');
                delete agent[uuid];
            });
        });
    }
    else {
        var prevActiveAgents = _.keys(cache);
        var foundAgentIds = [];

        _.forEach(agentIdToDetections, function (detections, agentId) {
            foundAgentIds.push(agentId);

            if (!cache[agentId]) {
                cache[agentId] = [];
            }
            var seenBeacons = cache[agentId];
            var prevInRangeBeaconUuids = _.keys(seenBeacons);

            var foundBeaconUuids = [];
            detections.forEach(function (detection) {
                var beaconUuid = detection.uuid;
                foundBeaconUuids.push(beaconUuid)

                var currentBeacon = seenBeacons[detection.uuid];
                if (!currentBeacon) {
                    // first time this agent has seen this beacon
                    //[Lindsay Thurmond:10/29/14] TODO: fire enter region event
                    publishDetectionEvent(agentId, beaconUuid, 'enter');

                    // add beacon to cache so we know we've previously seen it
                    currentBeacon = { time: detection.time, proximity: detection.proximity };
                    seenBeacons[beaconUuid] = currentBeacon;
                } else {
                    // broadcast that we are still alive
                    publishDetectionEvent(agentId, beaconUuid, 'alive');
                }

                //[Lindsay Thurmond:10/29/14] TODO: other events

            });

            // We've gone through all the detections.
            // Are there any that we used to know about that we didn't get an update for?
            var outOfRangeBeacons = _.difference(prevInRangeBeaconUuids, foundBeaconUuids);
            if (outOfRangeBeacons.length > 0) {
                // at least one beacon went out of range
                // remove them from the cache
                outOfRangeBeacons.forEach(function (beaconUuid) {
                    delete seenBeacons[beaconUuid];
                    // fire event that the beacon left range
                    publishDetectionEvent(agentId, beaconUuid, 'exit');
                });
            }

        });

        //[Lindsay Thurmond:10/30/14] TODO: test me
        // we've gone through all the agents, see if there are any we stopped getting updates for
        var inactiveAgents = _.difference(prevActiveAgents, foundAgentIds);
        if (inactiveAgents.length > 0) {
            // remove agent from cache
            inactiveAgents.forEach(function(agentId){
                // send exit event for all of its beacons
                _.keys(cache[agentId]).forEach(function(beaconUuid){
                    publishDetectionEvent(agentId, beaconUuid, 'exit');
                })
                delete cache[agentId];
            });
        }

    }

    //[Lindsay Thurmond:10/30/14] TODO: delete me
//    cache = {};
}

var DETECTION_EVENT_TYPE = 'com.makeandbuild.detection';

function publishDetectionEvent(agentId, beaconUuid, eventType) {
    eventPublisherService.publishEvent(DETECTION_EVENT_TYPE, [agentId, beaconUuid, eventType]);
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