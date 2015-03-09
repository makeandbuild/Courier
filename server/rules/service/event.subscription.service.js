'use strict';

var config = require('../config');
var io = require('socket.io-client');
var socket = io(config.baseUrl + '/rules');
var detectionEventService = require('./detection.event.service.js');

module.exports.register = function() {
    socket.on('connect', function () {
        console.log('Rules engine socket connect');

        //[Lindsay Thurmond:3/9/15] TODO: give actual details about ourselves, id, etc - this will matter once we start saving rules engines to the db
        // give the server details about ourselves
        socket.emit('register', {});
    });

    socket.on('disconnect', function () {
        console.log('Rules engine socket disconnect');
    });

    socket.on('detectionEvent', function (payload) {
        console.log("Rules engine received detectionEvent payload: " + JSON.stringify(payload));
        detectionEventService.processDetectionEvent(payload);
    });
}