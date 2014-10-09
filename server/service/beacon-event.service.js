/**
 * Service layer for beacon events
 */
'use strict';

var agentService = require('./agent.service.js');

/**
 * Converts beacon event to an array of beacon detections.
 * @param beaconEvent
 * @returns {Array}
 */
function convertEventToDetections(beaconEvent) {
    var detections = [];

    if (beaconEvent && beaconEvent.detections) {
        beaconEvent.detections.forEach(function(detection) {
            detection.agentId = beaconEvent.agentId;
            detections.push(detection);
        })
    }
    return detections;
}

function findMostRecentPing(beaconEvent, callback) {

    if (!beaconEvent) {
        return callback('No beacon event specified');
    }
    if (!beaconEvent.detections) {
        return callback('Pings array is empty');
    }
    if (!beaconEvent.detections instanceof Array) {
        return callback('Pings is expected to be an array');
    }

    var pings = beaconEvent.detections;

    var mostRecentPing;
    pings.forEach(function (ping) {
        if (!mostRecentPing || mostRecentPing.time < ping.time) {
            mostRecentPing = ping;
        }
    });

    if (mostRecentPing) {
        return callback(null, mostRecentPing);
    } else {
        return callback('No recent ping found');
    }

}

 function updateAgentWithMostRecentPing(beaconEvent, callback) {
    if (!beaconEvent) {
        return callback('No beacon event specified');
    }
    if (!beaconEvent.agentId) {
        return callback('No agent found');
    }

    findMostRecentPing(beaconEvent, function (err, mostRecentPing) {
        if (err) {
            return callback(err);
        }
        if (mostRecentPing) {
            var agentId = beaconEvent.agentId;
            agentService.findAgentById(agentId)
                .then(function(foundAgent){
                    if (!foundAgent) {
                        return callback('Could not find agent');
                    }

                    // update agent with new heartbeat (time + id)

                    foundAgent.lastSeen = mostRecentPing.time;
                    foundAgent.lastSeenBy = mostRecentPing.uuid;

                    agentService.updateAgent(foundAgent, callback);
                });
        }

    });
}

exports.convertEventToDetections = convertEventToDetections;
exports.findMostRecentPing = findMostRecentPing;
exports.updateAgentWithMostRecentPing = updateAgentWithMostRecentPing;