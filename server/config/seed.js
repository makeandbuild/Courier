/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../models/user.model.js');
var Beacon = require('../models/beacon.model.js');
var Agent = require('../models/agent.model.js');

module.exports = function (complete) {

    //[Lindsay Thurmond:9/29/14] TODO: there is probably a better way to do this
    var usersLoaded = false;
    var agentsLoaded = false;

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
                if (agentsLoaded === true) {
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
                if (usersLoaded === true) {
                    complete();
                }
            }
        );
    });
}

