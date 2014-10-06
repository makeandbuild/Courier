'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconDetectionService = require('../../service/beacon-detection.service.js');

//[Lindsay Thurmond:10/3/14] TODO: get by date
//[Lindsay Thurmond:10/3/14] TODO: get by agent
/**
 * GET /api/beacondetections
 * Get unfiltered list of all beacon detections.
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

    //[Lindsay Thurmond:10/1/14] TODO: save to database


    res.send(200, 'ok');
};
