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
 * Create an array of beacon detections
 *
 * @param beaconDetections
 * @param callback
 */
function saveDetections(beaconDetections, callback) {
    // Depending on how many we are trying to insert at once, we may want to change to insert
    // (draw back is that it bypasses the mongoose schema validation).  For now
    // I'm sticking with create() until it becomes a problem.
    // BeaconDetection.collection.insert(beaconDetections, callback);
    BeaconDetection.create(beaconDetections, callback);
}

exports.findDetections = findDetections;
exports.saveDetection = saveDetection;
exports.saveDetections = saveDetections;
