'use strict';

var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
var beaconEventService = require('../../service/beacon-event.service.js');
var beaconDetectionService = require('../../service/beacon-detection.service.js');


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

    var beaconEvent = req.body;

    // logging
    var logLine = JSON.stringify(beaconEvent);
    console.log(logLine);
    if (config.log.beaconDetections === true) {
        //[Lindsay Thurmond:10/2/14] TODO: log as individual beacon detections instead?
        logger.detections(logLine);
    }

    var detections = beaconEventService.convertEventToDetections(beaconEvent);

    //[Lindsay Thurmond:10/5/14] TODO: update to use promises instead

    beaconEventService.updateAgentWithMostRecentPing(beaconEvent, function(err, agent) {
        if (err || !agent) {
            logger.log('error', err);
        }
    });


    beaconDetectionService.saveDetections(detections, function(err, detections) {
        if (err) {
            return res.send(500, err);
        }
        if (!detections) {
            return res.send(404);
        }
        return res.json(200);

    });

    //[Lindsay Thurmond:10/1/14] TODO: save detections to database

    //[Lindsay Thurmond:10/1/14] TODO: save to database regardless of whether an agent id is specified
}