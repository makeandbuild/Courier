/**
 * POST    /pings              ->  ping
 */

'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
//var agentService = require('../../service/agent.service.js');


// POST /api/beaconDetections
// send single ping
exports.create = function (req, res) {

    console.log(req.body);

    //convert incoming json to log line to append to file
    var logLine = JSON.stringify(req.body);

    //save ping to log file
    logger.detections(logLine);

    //[Lindsay Thurmond:10/1/14] TODO: save to database


    res.send(200, 'ok');
};