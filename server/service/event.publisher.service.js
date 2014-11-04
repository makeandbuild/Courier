'use strict';

var autobahn = require('autobahn');
var config = require('../config/environment');

//[Lindsay Thurmond:11/3/14] TODO: remove this when wamp configured correctly
var detectionEventService = require('../rules/service/detection.event.service.js');

var connection;
var session;

/**
 * Call when app starts up.
 */
exports.openConnection = function openConnection() {

    connection = new autobahn.Connection({
        url: config.crossbarUrl,
        realm: 'realm1'
    });

    connection.onopen = function (ses) {
        session = ses;
        console.log('Publisher connection is open');
    };

    // fired when connection was lost (or could not be established)
    connection.onclose = function (reason, details) {
        console.log("Publisher connection lost: " + reason);
    }

    connection.open();
}

exports.publishEvent = function publishEvent(topic, args) {

    // fake it for now until we get crossbar setup on jenkins
//    session.publish(topic, args);
//    console.log('Published an event for: ' + topic);

    // bypass WAMP for now, and just send straight to event listener
    detectionEventService.processDetectionEvent(args);

}