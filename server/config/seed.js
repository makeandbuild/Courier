/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var beaconService = require('../service/beacon.service.js');
var beaconDetectionService = require('../service/beacon-detection.service.js');
var agentService = require('../service/agent.service.js');

var userService = require('../service/user.service.js');
var beaconDao = require('../dao/beacon.dao.js');
var agentDao = require('../dao/agent.dao.js');
var beaconDetectionDao = require('../dao/beacon-detection.dao.js');

var seedData = require('./seedData.js');

module.exports = function (complete) {

    var savedAgents;
    var savedBeacons;

    // delete users
    userService.deleteAllUsers()
        // then populate users
        .then(function () {
            var createPromise = userService.createUsers(seedData.users);

            createPromise.then(function() {
                console.log('finished populating users');
            });

            return createPromise;
        })
        // then delete beacons
        .then(function () {
            return beaconDao.deleteAllBeacons();
        })
        // then populate beacons
        .then(function () {
            var createPromise = beaconService.createBeacons(seedData.beacons);
            createPromise.then(function (beacons) {
                savedBeacons = beacons;
                console.log('finished populating beacons');
            });
            return createPromise;
        })
        // then delete agents
        .then(function () {
            return agentDao.deleteAllAgents();
        })
        // then populate agents
        .then(function () {
            var createPromise = agentService.createAgents(seedData.agents);
            createPromise.then(function (agents) {
                savedAgents = agents;
                console.log('finished populating agents');
            });
            return createPromise;
        })
        // then delete detections
//        .then(function () {
//            return beaconDetectionDao.deleteAllDetections();
//        })
        // then populate detections
        .then(function () {
            var createPromise = beaconDetectionService.createDetections([
                {
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11111,
                    minor: 22222,
                    tx: 3,
                    rssi: 1,
                    proximity: 1.2,
                    agentId: savedAgents[0].customId
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11112,
                    minor: 22223,
                    tx: 4,
                    rssi: 2,
                    proximity: 2.2,
                    agentId: savedAgents[1].customId
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[1].uuid,
                    major: 1,
                    minor: 1,
                    tx: -65,
                    rssi: -75,
                    proximity: 3.7,
                    agentId: savedAgents[2].customId
                }
            ]);

            createPromise.then(function () {
                console.log('finished populating beacon detections');
            });
            return createPromise;
        }
    )
        .then(function () {
            console.log('Seed data complete!');
            complete();
        }, function (err) {
            console.log('Error loading seed data: ' + err);
        });
}

