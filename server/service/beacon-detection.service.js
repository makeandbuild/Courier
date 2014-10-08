/**
 * Service layer for beacon events
 */
'use strict';

var when = require('when');
var beaconDetectionDao = require('../dao/beacon-detection.dao.js');
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

    BeaconDetection.create(beaconDetection, function (err, savedDetection) {
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
 * Create an array of beacon detections.
 * Promise will contain an array of the saved detections.
 *
 * @param beaconDetections
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetections(beaconDetections, timeAsMs) {
    var promise = when(beaconDetectionDao.createDetectionsPromise(beaconDetections));
    if (timeAsMs && timeAsMs === true) {
        var defer = when.defer();
        // convert dates to ms timestamps
        promise.then(function (detections) {
            var savedDetections = [];
            detections.forEach(function(savedDetection){
                // flip the dates back to ms for consistency
                if (savedDetection.time) {
                    savedDetection.time = savedDetection.time.getTime();
                }
                savedDetections.push(savedDetection);
            });
            defer.resolve(savedDetections);
        }, function(err) {
            defer.reject(err);
        });
        return defer.promise;
    } else {
        return promise;
    }
}

//[Lindsay Thurmond:10/7/14] TODO:  still figuring out the best way to use promises, cleanup below

exports.getDeleteAllDetectionsPromise = function getDeleteAllDetectionsPromise() {
    return BeaconDetection.remove({}).exec();
}

function deleteAllDetections(callback) {
    var deferred = when.defer();

    BeaconDetection.remove({}, function (err) {
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
