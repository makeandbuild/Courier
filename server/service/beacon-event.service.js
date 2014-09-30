/**
 * Service layer for beacon events
 */
'use strict';

var agentService = require('./agent.service.js');

function findMostRecentPing(beaconEvent, callback) {

    if (!beaconEvent) {
        return callback('No beacon event specified');
    }
    if (!beaconEvent.pings) {
        return callback('Pings array is empty');
    }
    if (!beaconEvent.pings instanceof Array) {
        return callback('Pings is expected to be an array');
    }

    var pings = beaconEvent.pings;

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
    if (!beaconEvent.agent) {
        return callback('No agent found');
    }

    findMostRecentPing(beaconEvent, function (err, mostRecentPing) {
        if (err) {
            return callback(err);
        }
        if (mostRecentPing) {
            var agentId = beaconEvent.agent;
            agentService.findAgentById(agentId, function(err, foundAgent) {
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

exports.findMostRecentPing = findMostRecentPing;
exports.updateAgentWithMostRecentPing = updateAgentWithMostRecentPing;