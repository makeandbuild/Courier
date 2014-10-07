/**
 * Service layer for beacon events
 */
'use strict';

var BeaconDetection = require('./../models/beacon-detection.model.js');

function findDetections(callback, optionalFilters) {
    if (optionalFilters) {
        BeaconDetection.find(optionalFilters, callback);
    } else {
        BeaconDetection.find(callback);
    }
}

function findDetectionsByBeaconId(beaconId, callback) {
    var filters = {_id: beaconId};
    findDetections(callback, filters);
}

exports.findDetectionsByBeaconUuid = function(uuid, callback) {
    var filters = {uuid: uuid};
    findDetections(callback, filters);
}

function findDetectionsByAgentId(agentId, callback) {
    //[Lindsay Thurmond:10/7/14] TODO: implement me
}

function findDetectionsByDateRange(startDate, endDate, callback) {
    //[Lindsay Thurmond:10/6/14] TODO: implement me
}

/**
 * Create a single beacon detection
 *
 * @param beaconDetection
 * @param callback
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetection(beaconDetection, callback, timeAsMs) {

    BeaconDetection.create(beaconDetection, function(err, savedDetection) {
        if (err) {
            return callback(err);
        }

        if (timeAsMs && timeAsMs === true && savedDetection.time) {
            savedDetection.time = savedDetection.time.getTime();
        }
        return callback(null, savedDetection);
    });
}

/**
 * Create an array of beacon detections.  Callback will contain an array of the saved detections.
 *
 * @param beaconDetections
 * @param callback
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function saveDetections(beaconDetections, callback, timeAsMs) {
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
            if (timeAsMs && timeAsMs === true) {
                // flip the dates back to ms for consistency
                if (savedDetection.time) {
                    savedDetection.time = savedDetection.time.getTime();
                }
            }
            savedDetections.push(savedDetection);
        }
        return callback(null, savedDetections);
    });

}

exports.findDetections = findDetections;
exports.findDetectionsByDateRange = findDetectionsByDateRange;
exports.findDetectionsByBeaconId = findDetectionsByBeaconId;
exports.findDetectionsByAgentId = findDetectionsByAgentId;
exports.createDetection = createDetection;
exports.saveDetections = saveDetections;
