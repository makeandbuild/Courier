'use strict';

var _ = require('lodash');
var when = require('when');
var beaconService = require('../../service/beacon.service.js');
var agentService = require('../../service/agent.service.js');

/*
 {
 "agent1": {
 "beaconsInRange": [7878],
 "beaconCount": 1
 }
 }
 */
var agentStatusCache = {};

exports.getBeaconsInRangeOfLocationPromise = function getBeaconsInRangeOfLocationPromise(agentLocation) {

    var defer = when.defer();
    agentService.findByLocation(agentLocation)
        .then(function (foundAgent) {
            var agentCustomId = foundAgent.customId;
            var agentInfo = agentStatusCache[agentCustomId];

            if (agentInfo) {
                var beaconUniqueKeys = agentInfo.beaconsInRange;
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

exports.processDetectionEvent = function (args) {

    var agentId = args[0];
    var uuid = args[1];
    var major = args[2];
    var minor = args[3];
    var eventType = args[4];

    var beaconUniqueKey = createBeaconUniqueKey(uuid, major, minor);

    console.log('Processing detection event. AgentId = ' + agentId + ', Beacon uuid = ' + uuid + ', Major = + ' + major + ', Minor = + ' + minor + ', EventType = ' + eventType);

    var agentStatus;
    if ('enter' === eventType || 'alive' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (!agentStatus) {
            agentStatusCache[agentId] = { beaconsInRange: [beaconUniqueKey], beaconCount: 1 };
        } else {
            if (!_.contains(agentStatus.beaconsInRange, beaconUniqueKey)) {
                agentStatus.beaconsInRange.push(beaconUniqueKey);
                agentStatus.beaconCount = agentStatus.beaconsInRange.length;
            }
        }


    } else if ('exit' === eventType) {

        agentStatus = agentStatusCache[agentId];
        if (agentStatus) {
            agentStatus.beaconsInRange = _.without(agentStatus.beaconsInRange, beaconUniqueKey);
            agentStatus.beaconCount = agentStatus.beaconsInRange.length;
        }

    } else {
        console.log('Unsupported detection event type found: ' + eventType);
    }

    console.log('Current status: ' + JSON.stringify(agentStatusCache));


    //[Lindsay Thurmond:10/29/14] TODO: keep track of beacons in each room and display on webpage
}