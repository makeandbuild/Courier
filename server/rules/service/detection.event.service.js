'use strict';

var _ = require('lodash');
var when = require('when');
var beaconService = require('../../service/beacon.service.js');

/*
 {
 "agent1": {
 "beaconsInRange": [7878],
 "beaconCount": 1
 }
 }
 */
var agentStatusCache = {};

exports.getBeaconsInRangeOfPromise = function getBeaconsInRangeOf(agentCustomId) {
    var agentInfo = agentStatusCache[agentCustomId];

    var defer = when.defer();
    var found = [];
    if (agentInfo) {
        var beaconIds = agentInfo.beaconsInRange;

        var promises = [];
        beaconIds.forEach(function (beaconId) {
            var promise = beaconService.findByUuid(beaconId)
                .then(function (beacon) {
                    found.push(beacon);
                }, function (err) {
                    console.log(err);
                });
            promises.push(promise);
        });
    }

    when.all(promises)
        .then(function (beaconsInRange) {
            //[Lindsay Thurmond:11/3/14] TODO: not sure why the beaconsInRange array contains undefined ... figure out later
//            defer.resolve(beaconsInRange);
            defer.resolve(found);
        }, function (err) {
            defer.reject(err);
        });


    return defer.promise;
}

exports.processDetectionEvent = function (args) {

    var agentId = args[0]
    var uuid = args[1];
    var eventType = args[2];

    console.log('Processing detection event.  Agent id = ' + agentId + ', Beacon uuid = ' + uuid + ', Event type = ' + eventType);

    var agentStatus;
    if ('enter' === eventType || 'alive' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (!agentStatus) {
            agentStatusCache[agentId] = { beaconsInRange: [uuid], beaconCount: 1 };
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