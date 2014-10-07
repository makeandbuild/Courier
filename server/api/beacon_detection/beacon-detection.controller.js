'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconDetectionService = require('../../service/beacon-detection.service.js');

function handleError(res, err) {
  return res.send(500, err);
}


//[Lindsay Thurmond:10/3/14] TODO: get by date
//[Lindsay Thurmond:10/3/14] TODO: get by agent
//[Lindsay Thurmond:10/6/14] TODO: get by beacon uuid
/**
 * GET /api/beacondetections -> unfiltered array of all beacon detections
 *
 * //[Lindsay Thurmond:10/7/14] TODO: filtering still in progress
 * Optional query parameters:
 *  startdate
 *  enddate
 *  beacon
 *  agent
 *
 * GET /api/beacondetections?startdate= ->
 * GET /api/beacondetections?enddate= ->
 * GET /api/beacondetections?beacon= ->
 * GET /api/beacondetections?agent= ->
 *
    [
        {
           "_id" : "5432bbbbe4ca5c9a22bc765f",
           "distance" : 1.91,
           "major" : 1,
           "uuid" : "123e4567e89b12d3a456426655440000",
           "tx" : -62,
           "time" "2014-10-06T15:56:43.793Z",
           "rssi" : -75,
           "minor" : 2,
           "agentId" : "5432bbbbe4ca5c9a22bc765e"
        }
    ]
 *
 * Filter Options:
 *
 *
 * @param req
 * @param res
 */
exports.index = function(req, res) {
    beaconDetectionService.findDetections(function (err, detections) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, detections);
    });
}

/**
 * POST /api/beacondetections
 * Create a single beacon detection.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    // logging
    var logLine = JSON.stringify(req.body);
    console.log(req.body);
    if (config.log.beaconDetections === true) {
        logger.detections(logLine);
    }

    var detections = req.body;
    beaconDetectionService.createDetection(detections, function(err, detections) {
        if (err) {
            return res.send(500, err);
        }
        if (!detections) {
            return res.send(404);
        }
        console.log(detections);
        return res.json(201, detections);
    }, true);
};
