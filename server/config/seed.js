/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../models/user.model.js');
var Beacon = require('../models/beacon.model.js');
var Agent = require('../models/agent.model.js');
var BeaconDetection = require('../models/beacon-detection.model.js');
var mongoose = require('mongoose');

var beaconService = require('../service/beacon.service.js');
var agentService = require('../service/agent.service.js');

module.exports = function (complete) {

    var savedAgents;
    var savedBeacons;

    // delete users
    User.find({}).remove().exec()
        // then populate users
        .then(function () {
            var promise = new mongoose.Promise;
            User.create({
                    provider: 'local',
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'test'
                }, {
                    provider: 'local',
                    role: 'admin',
                    name: 'Admin',
                    email: 'admin@admin.com',
                    password: 'admin'
                }
                , function (err) {
                    if (err) {
                        promise.reject(err);
                    } else {
                        console.log('finished populating users');
                        promise.resolve();
                    }
                });
            return promise;
        })
        // then delete beacons
        .then(function () {
            return Beacon.find({}).remove().exec();
        })
        // then populate beacons
        .then(function () {
            var createPromise = beaconService.createBeaconsPromise([
                {
                    name: 'Beacon 55',
                    uuid: '6fdg76hdf',
                    major: 89,
                    minor: 90987,
                    active: true
                },
                {
                    name: 'Beacon 900',
                    uuid: 'fgh8dfhdf09',
                    major: 466,
                    minor: 77,
                    active: true
                },
                {
                    name: 'Beacon 8798797',
                    uuid: 'sd098fdg0sd98f',
                    major: 6554,
                    minor: 232,
                    active: true
                }
            ]);
            createPromise.then(function (beacons) {
                savedBeacons = beacons;
                console.log('finished populating beacons');
            });
            return createPromise;
        })
        // then delete agents
        .then(function () {
            return Agent.find({}).remove().exec();
        })
        // then populate agents
        .then(function () {
            var createPromise = agentService.createAgentsPromise([
                {
                    name: 'Agent 1',
                    location: 'entry way',
                    capabilities: ['audio'],
                    approvedStatus: 'Pending',
                    operationalStatus: 'Success',
                    lastSeenBy: savedBeacons[0].uuid,
                    lastSeen: Date.now()
                },
                {
                    name: 'Agent 2',
                    location: 'great room',
                    capabilities: ['audio'],
                    approvedStatus: 'Approved',
                    operationalStatus: 'Success'
                },
                {
                    name: 'Agent 3',
                    location: 'situation room',
                    capabilities: ['audio'],
                    approvedStatus: 'Denied',
                    operationalStatus: 'Failure'
                }
            ]);
            createPromise.then(function (agents) {
                savedAgents = agents;
                console.log('finished populating agents');
            });
            return createPromise;
        })
        // then delete detections
        .then(function () {
            return BeaconDetection.find({}).remove().exec();
        })
        // then populate detections
        .then(function () {
            var promise = new mongoose.Promise;
            BeaconDetection.create({
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11111,
                    minor: 22222,
                    tx: 3,
                    rssi: 1,
                    distance: 1.2,
                    agentId: savedAgents[0]._id
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11112,
                    minor: 22223,
                    tx: 4,
                    rssi: 2,
                    distance: 2.2,
                    agentId: savedAgents[1]._id
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[1].uuid,
                    major: 1,
                    minor: 1,
                    tx: -65,
                    rssi: -75,
                    distance: 3.7,
                    agentId: savedAgents[2]._id
                }, function (err) {
                    if (err) {
                        promise.reject(err);
                    } else {
                        console.log('finished populating beacon detections');
                        promise.resolve();
                    }
                }
            );
            return promise;
        }
    )
        .then(function () {
            console.log('Seed data complete!');
            complete();
        }, function (err) {
            console.log('Error loading seed data: ' + err);
        });
}

