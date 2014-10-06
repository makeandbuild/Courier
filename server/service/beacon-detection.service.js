/**
 * Service layer for beacon events
 */
'use strict';

var BeaconDetection = require('./../models/beacon-detection.model.js');

function findDetections(callback) {
    BeaconDetection.find(callback);
}

/**
 * Create a single beacon detection
 *
 * @param beaconDetection
 * @param callback
 */
function saveDetection(beaconDetection, callback) {
    BeaconDetection.create(beaconDetection, callback);
}

/**
 * Create an array of beacon detections.  Callback will contain an array of the saved detections.
 *
 * @param beaconDetections
 * @param callback
 */
function saveDetections(beaconDetections, callback) {
    // Depending on how many we are trying to insert at once, we may want to change to insert
    // (draw back is that it bypasses the mongoose schema validation).  For now
    // I'm sticking with create() until it becomes a problem.
    // BeaconDetection.collection.insert(beaconDetections, callback);
    BeaconDetection.create(beaconDetections, function() {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if(err) {
            return callback(err);
        }

        var savedDetections = [];
        for (var i = 1; i < arguments.length; i++) {
            var savedDetection = arguments[i];
            savedDetections.push(savedDetection);
        }
        // NOTE: if we want to send the date back as a ms string, we can change the
        // data here and convert each one with something like 'savedDetections[0].time.getTime()'
        return callback(null, savedDetections);
    });

}

exports.findDetections = findDetections;
exports.saveDetection = saveDetection;
exports.saveDetections = saveDetections;
