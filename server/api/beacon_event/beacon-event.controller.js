'use strict';

var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconEventService = require('../../service/beacon-event.service.js');


/**
 * POST /api/beaconevents
 *
 * {
        agentId: "540756a9a36b267c0a5965dd",
        detections: [
            {
                time: "1409847363.458166",
                uuid: "1000000000000000",
                major: "1",
                minor: "1",
                tx: "-65",
                rssi: "-75",
                distance: 1.6
            }
        ]
    }
 */
exports.index = function (req, res) {

    console.log(req.body);

    //convert incoming json to log line to append to file
    var logLine = JSON.stringify(req.body);

    //save ping to log file
    logger.detections(logLine);

    beaconEventService.updateAgentWithMostRecentPing(req.body, function(err, agent) {
        if (err) {
            return res.send(500, err);
        }
        if (!agent) {
            return res.send(404);
        }
        return res.json(200, agent);
    });

    //[Lindsay Thurmond:10/1/14] TODO: save detections to database

    //[Lindsay Thurmond:10/1/14] TODO: save to database regardless of whether an agent id is specified
}