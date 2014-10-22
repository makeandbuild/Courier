/**
 * Service layer for beacon events
 */
'use strict';

var when = require('when');

var agentService = require('./agent.service.js');

/**
 * Converts beacon event to an array of beacon detections.
 *
 * @param beaconEvent
 * @returns {Array}
 */
function convertEventToDetections(beaconEvent) {
    var detections = [];

    if (beaconEvent && beaconEvent.detections) {
        beaconEvent.detections.forEach(function (detection) {
            detection.agentId = beaconEvent.agentId;
            detections.push(detection);
        })
    }
    return detections;
}

/**
 *
 * @param beaconEvent
 * @returns {*}
 */
function findMostRecentDetection(beaconEvent) {

    if (!beaconEvent) {
        throw Error('No beacon event specified');
    }
    if (!beaconEvent.detections) {
        throw Error('Pings array is empty');
    }
    if (!beaconEvent.detections instanceof Array) {
        throw Error('Pings is expected to be an array');
    }

    var detections = beaconEvent.detections;

    var mostRecentDetection;
    detections.forEach(function (detection) {
        if (!mostRecentDetection || mostRecentDetection.time < detection.time) {
            mostRecentDetection = detection;
        }
    });

    if (mostRecentDetection) {
        return mostRecentDetection;
    } else {
        throw Error('No recent detection found');
    }

}

function updateAgentWithMostRecentPingPromise(beaconEvent) {
    if (!beaconEvent) {
        return when.reject('No beacon event specified');
    }
    if (!beaconEvent.agentId) {
        return when.reject('No agent found');
    }

    var defer = when.defer();

    try {
        var mostRecentPing = findMostRecentDetection(beaconEvent);

        var agentId = beaconEvent.agentId;
        agentService.findAgentByCustomId(agentId)
            .then(function (foundAgent) {
                if (!foundAgent) {
                    defer.reject('Could not find agent');
                    return;
                }

                // update agent with new heartbeat (time + id)

                foundAgent.lastSeen = mostRecentPing.time;
                foundAgent.lastSeenBy = mostRecentPing.uuid;

                agentService.updateAgent(foundAgent)
                    .then(function (agent) {
                        defer.resolve(agent);
                    }, function (err) {
                        defer.reject(err);
                    });
            });

    } catch (err) {
        defer.reject(err);
    }
    return defer.promise;

}

exports.convertEventToDetections = convertEventToDetections;
exports.findMostRecentDetection = findMostRecentDetection;
exports.updateAgentWithMostRecentPingPromise = updateAgentWithMostRecentPingPromise;