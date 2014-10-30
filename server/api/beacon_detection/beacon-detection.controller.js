'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconDetectionService = require('../../service/beacon-detection.service.js');


/**
 * GET /api/beacondetections -> unfiltered array of all beacon detections
 *
 * Optional query parameters:
 *  1) uuid: beacon uuid
 *  2) agentId: agent custom id (generally the mac address)
 *  3) time:
 *      Supported comparators:
 *          - gt = greater than
 *          - gte = grater than or equal
 *          - lt = less than
 *          - lte = less than or equal
 *
 *      Example ranges:
 *          time=gte 2013-10-09T08:40 lte 2014-10-09T08:40
 *          time=gte 2014-10-09T08:40
 *          time=gt 2014-10-09T08:40
 *          time=lte 2014-10-09T08:40
 *          time=lt 2014-10-09T08:40
 *
 * GET /api/beacondetections?time= ->
 * GET /api/beacondetections?uuid= ->
 * GET /api/beacondetections?agentId= ->
 *
 *   [
 *       {
 *          "_id" : "5432bbbbe4ca5c9a22bc765f",
 *          "distance" : 1.91,
 *          "major" : 1,
 *          "uuid" : "123e4567e89b12d3a456426655440000",
 *          "tx" : -62,
 *          "time" "2014-10-06T15:56:43.793Z",
 *          "rssi" : -75,
 *          "minor" : 2,
 *          "agentId" : "00:A0:C9:14:C8:29"
 *       }
 *   ]
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var uuid = req.query.uuid;
    var agentId = req.query.agentId;
    var time = req.query.time;
    beaconDetectionService.findFilteredDetections(uuid, agentId, time)
        .then(function (detections) {
            return res.json(200, detections);
        }, function (err) {
            return handleError(res, err);
        });
}

/**
 * POST /api/beacondetections
 * Creates one or more beacon detections.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    var detections = req.body;

    if (!(detections instanceof Array)) {
        // assume single object sent and wrap in array
        detections = [detections];
    }

    // logging
    var logLine = JSON.stringify(detections);
    console.log(detections);
    if (config.log.beaconDetections === true) {
        logger.detections(logLine);
    }

    //[Lindsay Thurmond:10/29/14] TODO: do we really need to wait for this to end to start saving? make async?
    // publish needed events
    // Do this before removing empty detections from list, b/c empty detections are
    // an indication that there aren't any beacons in range anymore
    beaconDetectionService.processEventsFromDetections(detections);

    // remove empty detections from list to save
    detections = _.remove(detections, function (detection) {
        return !_.isEmpty(detection);
    });
    if (detections.length === 0) {
        // all detections are empty, that's fine it just means the
        // beacon is out of range, but we don't need to save them
        return res.send(204, 'No detections to save');
    }

    // update agents with most recent - more of a nice to have, don't need to block the response for it
    beaconDetectionService.updateAgentsWithMostRecentDetectionPromise(detections)
        .then(function (descriptors) {
            descriptors.forEach(function (d) {
                if (d.state === 'rejected') {
                    console.log('Problem updating agents with most recent detection: ' + d.reason);
                }
            })
        });

    // pretend like we saved, but just pass back an empty array - YES THIS IS GOING TO BREAK THE TESTS
    return res.json(201, []);

    //[Lindsay Thurmond:10/30/14] TODO: THIS IS TEMPORARILY TURNED OFF SO WE DON'T SAVE DETECTIONS TO MONGO UNTIL AFTER THE MOVEMBER EVENT
    //[Lindsay Thurmond:10/30/14] TODO: BECAUSE WE DON'T WANT TO USE UP ALL THE SPACE ON THE PI
    // should always have an array of detections by now
//    beaconDetectionService.createDetectionsOneByOne(detections)
//        .then(function (result) {
//
//            //[Lindsay Thurmond:10/21/14] TODO: set response based on if errors happened
//            return res.json(201, result);
//        }, function (err) {
//            // something unexpected happened
//            return handleError(res, err);
//        });
};

function handleError(res, err) {
    return res.send(500, err);
}
