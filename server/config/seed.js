/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../models/user.model.js');
var Beacon = require('../models/beacon.model.js');
var Agent = require('../models/agent.model.js');
var BeaconDetection = require('../models/beacon-detection.model.js');
var beaconDetectionService = require('../service/beacon-detection.service.js');

module.exports = function (complete) {

    //[Lindsay Thurmond:9/29/14] TODO: there is probably a better way to do this - promises I'm assuming
    var usersLoaded = false;
    var agentsLoaded = false;
    var detectionsLoaded = false;

    User.find({}).remove(function () {
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
            }, function () {
                console.log('finished populating users');
                usersLoaded = true;
                if (agentsLoaded === true && detectionsLoaded === true) {
                    complete();
                }
            }
        );
    });

    Agent.find({}).remove(function () {
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
            }, function () {
                console.log('finished populating agents');
                agentsLoaded = true;
                if (usersLoaded === true && detectionsLoaded === true) {
                    complete();
                }
            }
        );
    });

    BeaconDetection.find({}).remove(function () {
        var sampleDetections = [
            {
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
            }
        ];

        beaconDetectionService.saveDetections(sampleDetections, function () {
            console.log('finished populating detections');
            detectionsLoaded = true;
            if (usersLoaded === true && agentsLoaded === true) {
                complete();
            }
        });
    });
}

