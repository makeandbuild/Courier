/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Beacon = require('../api/beacon/beacon.model');
var BeaconEvent = require('../api/beacon-event/beacon-event.model');
var Agent = require('../api/agent/agent.model');

User.find({}).remove(function() {
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
  }, function() {
      console.log('finished populating users');
    }
  );
});

// sample beacon data
//BeaconEvent.find({}).remove(function () {
//    BeaconEvent.create({
//        time: Date.now(),
//        uuid: '88888',
//        major: '11111',
//        minor: '22222',
//        tx: 3,
//        rssi: 1,
//        distance: 1.2
//    }, function() {
//        console.log('finished adding sample beacon event');
//    });
//});
