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
 *  2) agentId: agent mongo id
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
 *          "agentId" : "5432bbbbe4ca5c9a22bc765e"
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
    var bodyContent = req.body;

    // logging
    var logLine = JSON.stringify(bodyContent);
    console.log(bodyContent);
    if (config.log.beaconDetections === true) {
        logger.detections(logLine);
    }

    // handle multiple
    if (bodyContent instanceof Array) {
        var detections = bodyContent;
        //[Lindsay Thurmond:10/21/14] TODO: send to rules engine
        beaconDetectionService.createDetectionsOneByOne(detections)
            .then(function (result) {
                //[Lindsay Thurmond:10/21/14] TODO: set response based on if errors happened
                return res.json(201, result);
            }, function (err) {
                // something unexpected happened
                return handleError(res, err);
            });
    }
    // assume single
    else {
        var detection = bodyContent;
        beaconDetectionService.createDetection(detection, true)
            .then(function (detection) {
                if (!detection) {
                    return res.send(404);
                }
                console.log(detection);


                //[Lindsay Thurmond:10/21/14] TODO: send to rules engine
                //Emit event to Rules Engine - skipping rules engine for testing purposes now
//            beaconDetectionService.sendDetectionToRulesHandler();

                return res.json(201, detection);
            }, function (err) {
                return handleError(res, err);
            });
    }
};

function handleError(res, err) {
    return res.send(500, err);
}
