'use strict';

var socketio = require('../config/socketio');


// to publish that an event occurred so that we can easily separate the rules engine
// and just have it listening for the events
exports.publishDetectionEvent = function publishDetectionEvent(detectionEvent) {
    socketio.broadcastToRulesEngines('detectionEvent', detectionEvent);
}