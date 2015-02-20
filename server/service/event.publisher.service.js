'use strict';

var config = require('../config/environment');

//[Lindsay Thurmond:11/3/14] TODO: remove this when wamp configured correctly
var detectionEventService = require('../rules/service/detection.event.service.js');


//[Lindsay Thurmond:2/20/15] TODO: eventually we want to use websockets (probably with socket.io)
// to publish that an event occurred so that we can separate the rules engine
// and just have it listening for the events - for now we'll just pass it to the
// to our event service manually

exports.publishEvent = function publishEvent(topic, args) {

    // bypass websockets for now, and just send straight to event listener
    detectionEventService.processDetectionEvent(args);

}