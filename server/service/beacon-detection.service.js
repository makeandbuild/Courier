/**
 * Service layer for beacon events
 */
'use strict';

var when = require('when');

var BeaconDetection = require('./../models/beacon-detection.model.js');

function findDetections(callback, optionalFilters) {
    if (optionalFilters) {
        BeaconDetection.find(optionalFilters, callback);
    } else {
        BeaconDetection.find(callback);
    }
}

function findFilteredDetections(uuid, agentId, startDate, endDate, callback) {
    var filters;
    if (uuid || agentId || startDate || endDate) {
        filters = {};

        if (uuid) {
            filters.uuid = uuid;
        }
        if (agentId) {
            filters.agentId = agentId;
        }
        //[Lindsay Thurmond:10/7/14] TODO: start & end dates
    }
    findDetections(callback, filters);
};

function findDetectionsByUuid(uuid, callback) {
    var filters = {uuid: uuid};
    findDetections(callback, filters);
}

function findDetectionsByAgentId(agentId, callback) {
    var filters = {agentId: agentId};
    findDetections(callback, filters);
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
function createDetections(beaconDetections, callback, timeAsMs) {
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

//[Lindsay Thurmond:10/7/14] TODO:  still figuring out the best way to use promises, cleanup below

exports.getDeleteAllDetectionsPromise = function getDeleteAllDetectionsPromise() {
    return BeaconDetection.remove({}).exec();
}

function deleteAllDetections(callback) {
    var deferred = when.defer();

    BeaconDetection.remove({}, function(err) {
        deferred.promise.nodeify(callback);
    });

    return deferred.promise;
}

exports.findDetections = findDetections;
exports.findDetectionsByDateRange = findDetectionsByDateRange;
exports.findDetectionsByAgentId = findDetectionsByAgentId;
exports.findFilteredDetections = findFilteredDetections;
exports.findDetectionsByUuid = findDetectionsByUuid;
exports.createDetection = createDetection;
exports.createDetections = createDetections;
exports.deleteAllDetections = deleteAllDetections;
