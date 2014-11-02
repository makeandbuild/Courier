'use strict';

var _ = require('lodash');

//[Lindsay Thurmond:10/30/14] TODO: do we need to actually save these somewhere?

/*
 {
     "agent1": {
         "beaconsInRange": [7878],
         "beaconCount": 1
     }
 }
 */
var agentStatusCache = {};

exports.processDetectionEvent = function (args) {

    var agentId = args[0]
    var uuid = args[1];
    var eventType = args[2];

    console.log('Processing detection event.  Agent id = ' + agentId + ', Beacon uuid = ' + uuid + ', Event type = ' + eventType);

    var agentStatus;
    if ('enter' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (!agentStatus) {
            agentStatusCache[agentId] = { beaconsInRange : [uuid], beaconCount : 1 };
        } else {
            if (!_.contains(agentStatus.beaconsInRange, uuid)) {
                agentStatus.beaconsInRange.push(uuid);
                agentStatus.beaconCount = agentStatus.beaconsInRange.length;
            }
        }


    } else if ('exit' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (agentStatus) {
            agentStatus.beaconsInRange = _.without(agentStatus.beaconsInRange, uuid);
            agentStatus.beaconCount = agentStatus.beaconsInRange.length;
        }

    } else {
        console.log('Unsupported detection event type found: ' + eventType);
    }

    console.log('Current status: ' + JSON.stringify(agentStatusCache));



    //[Lindsay Thurmond:10/29/14] TODO: keep track of beacons in each room and display on webpage
}