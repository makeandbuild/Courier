'use strict';

var _ = require('lodash');
var when = require('when');
var beaconService = require('../../service/beacon.service.js');
var agentService = require('../../service/agent.service.js');
var socketio = require('../../config/socketio.js');

/**
 * Format:
 *  {
 *     "agentId": {
 *         "beaconsInRange": [beaconUniqueKey],
 *         "beaconCount": 1
 *     }
 * }
 *
 * Example:
 * {
 *   "10.1.10.34" :
 *      {
 *         "beaconsInRange" :
 *            [
 *               {
 *                  "key": "b9407f30f5f8466eaff925556b57fe6d:19602:10956",
 *                  "lastProximity" : 2.4545
 *               }
 *
 *            ],
 *         "beaconCount" : 1
 *      },
 *   "10.1.10.111" :
 *      {
 *         "beaconsInRange" :
 *            [
 *               "b9407f30f5f8466eaff925556b57fe6d:25:18",
 *               "b9407f30f5f8466eaff925556b57fe6d:99:73",
 *               "b9407f30f5f8466eaff925556b57fe6d:22:35"
 *            ],
 *         "beaconCount" : 3
 *      },
 *   "10.1.10.110" :
 *      {
 *         "beaconsInRange" : [],
 *         "beaconCount" : 0
 *      }
 * }
 *
 *
 * @type {{}}
 */
var agentStatusCache = {};

exports.getBeaconsInRangeOfLocationPromise = function getBeaconsInRangeOfLocationPromise(agentLocation) {

    var defer = when.defer();
    agentService.findByLocation(agentLocation)
        .then(function (foundAgent) {
            var agentCustomId = foundAgent.customId;
            var agentInfo = agentStatusCache[agentCustomId];

            if (agentInfo) {
                var beaconUniqueKeys = [];
                _.forEach(agentInfo.beaconsInRange, function(beaconStatus){
                    beaconUniqueKeys.push(beaconStatus.key);
                });

                var beaconUniqueKeysToRemove = [];

                // filter out any keys found by two beacons if needed (we only want to show it for the agent its closest to)
                var currentAgentIds = _.keys(agentStatusCache);
                _.forEach(currentAgentIds, function(agentId) {
                    if (agentId !== agentCustomId) {
                        var otherAgentInfo = agentStatusCache[agentId];
                        _.forEach(otherAgentInfo.beaconsInRange, function(otherBeaconStatus){
                            // is this beacon key in the list for this agent?
                            if (beaconUniqueKeys.indexOf(otherBeaconStatus.key) != -1) {
                                // which one is it closer to?
                                _.forEach(agentInfo.beaconsInRange, function(beaconStatus) {
                                    if (beaconStatus.key === otherBeaconStatus.key) {
                                        if (otherBeaconStatus.lastProximity < beaconStatus.lastProximity) {
                                            // its closer to another agent, so remove it from our lookup list
                                            beaconUniqueKeysToRemove.push(beaconStatus.key);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                beaconUniqueKeys = _.difference(beaconUniqueKeys, beaconUniqueKeysToRemove);

                return lookUpBeaconsByUniqueKeysPromise(beaconUniqueKeys);
            } else {
                return when.resolve([]);
            }
        })
        //[Lindsay Thurmond:11/4/14] TODO: can i just return this promise instead?
        .then(function(beacons){
            defer.resolve(beacons);
        }, function(err){
            defer.reject(err);
        });

    return defer.promise;
}

function lookUpBeaconsByUniqueKeysPromise(beaconUniqueKeys) {
    var defer = when.defer();

    var found = [];
    var promises = [];
    beaconUniqueKeys.forEach(function (beaconUniqueKey) {
        var promise = beaconService.findByUniqueKey(beaconUniqueKey)
            .then(function (beacon) {
                found.push(beacon);
            }, function (err) {
                console.log(err);
            });
        promises.push(promise);
    });

    when.all(promises)
        .then(function (beaconsInRange) {
            //[Lindsay Thurmond:11/3/14] TODO: not sure why the beaconsInRange array contains undefined ... figure out later
//            defer.resolve(beaconsInRange);
            defer.resolve(found);
        }, function (err) {
            defer.reject(err);
        })
        .otherwise(function (err) {
            defer.reject(err);
        });

    return defer.promise;
}

function createBeaconUniqueKey(uuid, major, minor) {
    return uuid + ":" + major + ":" + minor;
}

function updateAgentStatusCache(eventType, agentId, beaconUniqueKey, proximity) {

    var agentStatus;
    if ('enter' === eventType || 'alive' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (!agentStatus) {
            agentStatusCache[agentId] = {
                beaconsInRange: [
                    {
                        key: beaconUniqueKey,
                        lastProximity: proximity
                    }
                ],
                beaconCount: 1
            };
        } else {
            var beaconUniqueKeys = [];
            _.forEach(agentStatus.beaconsInRange, function (beaconStatus) {
                beaconUniqueKeys.push(beaconStatus.key);
            });

            if (_.contains(beaconUniqueKeys, beaconUniqueKey)) {
                // update proximity
                _.forEach(agentStatus.beaconsInRange, function (beaconStatus) {
                    if (beaconStatus.key === beaconUniqueKey) {
                        beaconStatus.lastProximity = proximity;
                    }
                });
            }
            else {
                // add to list for first time
                agentStatus.beaconsInRange.push({ key: beaconUniqueKey, lastProximity: proximity});
                agentStatus.beaconCount = agentStatus.beaconsInRange.length;
            }
        }


    } else if ('exit' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (agentStatus) {
            agentStatus.beaconsInRange = _.remove(agentStatus.beaconsInRange, function (beaconStatus) {
                return beaconStatus.key !== beaconUniqueKey;
            });

            agentStatus.beaconCount = agentStatus.beaconsInRange.length;
        }

    } else {
        console.log('Unsupported detection event type found: ' + eventType);
    }

    console.log('Current status: ' + JSON.stringify(agentStatusCache));

    // just use this for local testing with a single agent
//    var agents = _.values(agentStatusCache);
//    var numBeacons = agents && agents.length > 0 ? agents[0].beaconCount : 0;
//    console.log('Current number of beacons: ' + numBeacons);
}

exports.processDetectionEvent = function (args) {

    var agentId = args[0];
    var uuid = args[1];
    var major = args[2];
    var minor = args[3];
    var proximity = args[4];
    var eventType = args[5];

    var beaconUniqueKey = createBeaconUniqueKey(uuid, major, minor);

//    console.log('Processing detection event. AgentId = ' + agentId + ', Beacon uuid = ' + uuid + ', Major = + ' + major + ', Minor = + ' + minor + ', EventType = ' + eventType);

    updateAgentStatusCache(eventType, agentId, beaconUniqueKey, proximity);

    notifyEngine(agentId, uuid, major, minor, eventType);
}

/**
 * Keeps track of the last time an enter event was seen for a beacon for a particular agent.
 *
 * Dictionary key = agentId:uuid:major:minor
 * Dictionary value = timestamp in ms
 *
 *
 * @type {{}}
 */
var lastTimeBeaconEnterSoundPlayed = {};


function notifyEngine(agentId, uuid, major, minor, eventType) {

    // play audio on the agent that detected the beacon
    if ('enter' === eventType) {

        var playSound = true;
        // if we haven't played the enter noise in the last 10 seconds then we can play it
        var key = agentId + ':' + uuid + ':' + major + ':' + minor;
        var lastPlayed = lastTimeBeaconEnterSoundPlayed[key];
        if (lastPlayed) {
            // check if we played in last 10 seconds
            var now = Date.now();
            var tenSecondsAgo = now - (10 * 1000);
            // ok play sound if the last time we played the sound was more than 10 seconds ago
            playSound = lastPlayed < tenSecondsAgo;
            if (!playSound) {
                console.log('Enter event for %s, but sound was played within the last 10 seconds.  Not playing again.', key);
            }
        }

        if (playSound) {
            var beaconKey = createBeaconUniqueKey(uuid, major, minor);
            lookupAudio(agentId, beaconKey)
                .then(function (filename) {

                    // update last play time
                    lastTimeBeaconEnterSoundPlayed[key] = Date.now();
                    socketio.playAudioOnEngine(agentId, filename);

                }, function (err) {
                    console.log('Error sending play audio command: ' + err);
                });
        }
    }
}

/**
 *
 * @param agentId agent that detected the beacon
 * @param beaconKey beacon that was detected
 * @returns {When.Promise<T>} promise containing the filename of the audio file
 */
function lookupAudio(agentId, beaconKey) {
    var defer = when.defer();

    beaconService.findByUniqueKey(beaconKey)
        .then(function(beacon){

            var foundFilename  = false;

            if (beacon && beacon.audio) {
                var filename = beacon.audio.filename;
                if (filename && filename != '') {
                    foundFilename = true;
                    defer.resolve(filename);
                }
            }

            if (!foundFilename) {
                // check for agent default
                agentService.findAgentByCustomId(agentId)
                    .then(function (agent) {
                        if (agent && agent.audio) {
                            defer.resolve(agent.audio.filename);
                        } else {
                            // we didn't find anything, just send an empty filename
                            defer.resolve('');
                        }
                    }, function (err) {
                        defer.reject(err);
                    });
            }

        }, function(err){
            defer.reject(err);
        });

    return defer.promise;
}