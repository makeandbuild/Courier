'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
//var agentService = require('../../service/agent.service.js');

/**
 * POST /api/beaconDetections
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


//[Lindsay Thurmond:10/3/14] TODO: get beacons detections
//[Lindsay Thurmond:10/3/14] TODO: by date
//[Lindsay Thurmond:10/3/14] TODO: by agent
//[Lindsay Thurmond:10/3/14] TODO: beacon


