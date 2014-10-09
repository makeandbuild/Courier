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
        beaconEvent.detections.forEach(function(detection) {
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
function findMostRecentPing(beaconEvent) {

    if (!beaconEvent) {
        throw Error('No beacon event specified');
    }
    if (!beaconEvent.detections) {
        throw Error('Pings array is empty');
    }
    if (!beaconEvent.detections instanceof Array) {
        throw Error('Pings is expected to be an array');
    }

    var pings = beaconEvent.detections;

    var mostRecentPing;
    pings.forEach(function (ping) {
        if (!mostRecentPing || mostRecentPing.time < ping.time) {
            mostRecentPing = ping;
        }
    });

    if (mostRecentPing) {
        return mostRecentPing;
    } else {
        throw Error('No recent ping found');
    }

}

 function updateAgentWithMostRecentPingPromise(beaconEvent) {
    if (!beaconEvent) {
        return when.reject('No beacon event specified');
    }
    if (!beaconEvent.agentId) {
        return when.reject('No agent found');
    }

     var promise = when();

     try {
         var mostRecentPing = findMostRecentPing(beaconEvent);

         var agentId = beaconEvent.agentId;
         agentService.findAgentById(agentId)
             .then(function(foundAgent){
                 if (!foundAgent) {
                     promise.reject('Could not find agent');
                     return;
                 }

                 // update agent with new heartbeat (time + id)

                 foundAgent.lastSeen = mostRecentPing.time;
                 foundAgent.lastSeenBy = mostRecentPing.uuid;

                 agentService.updateAgent(foundAgent)
                     .then(function(agent){
                         promise.resolve(agent);
                     }, function(err){
                         promise.reject(err);
                     });
             });

     } catch(err) {
        promise.reject(err);
     }
     return promise;

}

exports.convertEventToDetections = convertEventToDetections;
exports.findMostRecentPing = findMostRecentPing;
exports.updateAgentWithMostRecentPingPromise = updateAgentWithMostRecentPingPromise;