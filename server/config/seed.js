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

module.exports = function (complete) {

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
        // then delete agents
        .then(function () {
            return Agent.find({}).remove().exec();
        })
        // then populate agents
        .then(function () {
            var promise = new mongoose.Promise;
            Agent.create({
                    name: 'Agent 1',
                    location: 'entry way',
                    capabilities: ['audio'],
                    approvedStatus: 'Pending',
                    operationalStatus: 'Success'
                }, {
                    name: 'Agent 2',
                    location: 'great room',
                    capabilities: ['audio'],
                    approvedStatus: 'Approved',
                    operationalStatus: 'Success'
                }, {
                    name: 'Agent 3',
                    location: 'situation room',
                    capabilities: ['audio'],
                    approvedStatus: 'Denied',
                    operationalStatus: 'Failure'
                }, function (err) {
                    if (err) {
                        promise.reject(err);
                    } else {
                        console.log('finished populating agents');
                        promise.resolve();
                    }
                }
            );
            return promise;
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
                    uuid: '0000000',
                    major: 11111,
                    minor: 22222,
                    tx: 3,
                    rssi: 1,
                    distance: 1.2
                },
                {
                    time: Date.now(),
                    uuid: '0000001',
                    major: 11112,
                    minor: 22223,
                    tx: 4,
                    rssi: 2,
                    distance: 2.2
                },
                {
                    time: Date.now(),
                    uuid: '8uf98asu',
                    major: 1,
                    minor: 1,
                    tx: -65,
                    rssi: -75,
                    distance: 3.7
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
            console.log('done populating seed data');
            complete();
        }, function (err) {
            console.log('error loading seed data: ' + err);
        });
}

