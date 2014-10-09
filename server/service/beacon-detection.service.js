/**
 * Service layer for beacon events
 */
'use strict';

var when = require('when');
var beaconDetectionDao = require('../dao/beacon-detection.dao.js');
var dateQueryParser = require('../utils/date.query.parser.js');

function findDetections(optionalFilters) {
    if (optionalFilters) {
        return when(beaconDetectionDao.findFilteredDetectionsPromise(optionalFilters));
    } else {
        return when(beaconDetectionDao.findAllDetectionsPromise());
    }
}

function findFilteredDetections(uuid, agentId, time) {
    var filters;
    if (uuid || agentId || time) {
        filters = {};

        if (uuid) {
            filters.uuid = uuid;
        }
        if (agentId) {
            filters.agentId = agentId;
        }
        if (time) {
            filters.time = dateQueryParser.convertQueryToMongoFilter(time);
        }
    }
    return findDetections(filters);
};

function findDetectionsByUuid(uuid) {
    var filters = {uuid: uuid};
    return findDetections(filters);
}

function findDetectionsByAgentId(agentId) {
    var filters = {agentId: agentId};
    return findDetections(filters);
}

function findDetectionsByDateRange(time) {
    var filters;
    if (time) {
        filters = {time: dateQueryParser.convertQueryToMongoFilter(time)};
    }
    return findDetections(filters);
}

/**
 * Create a single beacon detection
 *
 * @param beaconDetection
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetection(beaconDetection, timeAsMs) {
    var promise = when(beaconDetectionDao.createDetectionPromise(beaconDetection));

    if (timeAsMs && timeAsMs === true) {
        var defer = when.defer();
        promise.then(function(savedDetection){
            if (savedDetection.time) {
                savedDetection.time = savedDetection.time.getTime();
            }
            defer.resolve(savedDetection);
        })
        return defer.promise;

    } else {
        return promise;
    }
}

//function changeDetectionTimeStringToDate(detection) {
//    if (detection && detection.time && detection.time instanceof String) {
//        // convert to date
//        detection.time = moment.utc(detection.time).toDate();
//    }
//}

/**
 * Create an array of beacon detections.
 * Promise will contain an array of the saved detections.
 *
 * @param beaconDetections
 * @param timeAsMs optional: if you want the time formatted as a ms timestamp
 */
function createDetections(beaconDetections, timeAsMs) {
//    beaconDetections.forEach(changeDetectionTimeStringToDate);

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

exports.deleteAllDetections = function deleteAllDetections() {
    return when(beaconDetectionDao.deleteAllDetections());
}


exports.findDetections = findDetections;
exports.findDetectionsByDateRange = findDetectionsByDateRange;
exports.findDetectionsByAgentId = findDetectionsByAgentId;
exports.findFilteredDetections = findFilteredDetections;
exports.findDetectionsByUuid = findDetectionsByUuid;
exports.createDetection = createDetection;
exports.createDetections = createDetections;