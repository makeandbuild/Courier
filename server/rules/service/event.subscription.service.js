'use strict';

var autobahn = require('autobahn');
var config = require('../../config/environment');
var detectionEventService = require('./detection.event.service.js');


exports.registerListeners = function registerListeners() {
    var connection = new autobahn.Connection({
            url: config.crossbarUrl,
            realm: 'realm1'}
    );

    connection.onopen = function (session) {

        console.log('Subscription connection open');

        function onDetectionEvent(args) {
            // handle in service
            detectionEventService.processDetectionEvent(args);
        }

        // register listeners
        session.subscribe('com.makeandbuild.detection', onDetectionEvent);
    };

    // fired when connection was lost (or could not be established)
    connection.onclose = function (reason, details) {
        console.log("Subscription connection lost: " + reason);
    }

    connection.open();
}