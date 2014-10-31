'use strict';

var autobahn = require('autobahn');
var config = require('../config/environment');

var connection;
var session;

/**
 * Call when app starts up.
 */
exports.openConnection = function openConnection() {

//    connection = new autobahn.Connection({
//        url: config.crossbarUrl,
//        realm: 'realm1'
//    });
//
//    connection.onopen = function (ses) {
//        session = ses;
//        console.log('WAMP connection is open');
//    };
//
//    // fired when connection was lost (or could not be established)
//    connection.onclose = function (reason, details) {
//        console.log("WAMP connection lost: " + reason);
//    }
//
//    connection.open();
}

exports.publishEvent = function publishEvent(topic, args) {

//    session.publish(topic, args);
//    console.log('Published an event for: ' + topic);

}