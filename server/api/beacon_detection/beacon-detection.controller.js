'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconDetectionService = require('../../service/beacon-detection.service.js');


//[Lindsay Thurmond:10/3/14] TODO: get by date
/**
 * GET /api/beacondetections -> unfiltered array of all beacon detections
 *
 * //[Lindsay Thurmond:10/7/14] TODO: filtering still in progress
 * Optional query parameters:
 *  startdate
 *  enddate
 *  uuid
 *  agentId
 *
 * GET /api/beacondetections?startdate= ->
 * GET /api/beacondetections?enddate= ->
 * GET /api/beacondetections?uuid= ->
 * GET /api/beacondetections?agentId= ->
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
exports.index = function (req, res) {
    var uuid = req.query.uuid;
    var agentId = req.query.agentId;
    //[Lindsay Thurmond:10/7/14] TODO: date range doesn't work yet
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    beaconDetectionService.findFilteredDetections(uuid, agentId, startDate, endDate)
        .then(function (detections) {
            return res.json(200, detections);
        }, function (err) {
            return handleError(res, err);
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

    var detection = req.body;
    beaconDetectionService.createDetection(detection, true)
        .then(function (detection) {
            if (!detection) {
                return res.send(404);
            }
            console.log(detection);

            //Emit event to Rules Engine - skipping rules engine for testing purposes now
            var connection = new autobahn.Connection({
         		url: 'ws://courier.makeandbuildatl.com:9015/ws',
         		realm: 'realm1'
      		});

			connection.onopen = function (session) {
	   			// Publish a play audio event
			   session.publish('com.makeandbuild.rpi.audio.play', ['https://s3.amazonaws.com/makeandbuild/courier/audio/1.wav']);
			};

			connection.open();

            return res.json(201, detection);
        }, function (err) {
            return handleError(res, err);
        });
};

function handleError(res, err) {
    return res.send(500, err);
}
