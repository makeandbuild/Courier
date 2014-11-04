'use strict';

var beaconService = require('../../service/beacon.service.js');
var detectionEventService = require('../../rules/service/detection.event.service.js');
var sampleData = require('./sampleBeaconData.js');

/**
 * Get list of beacons
 * GET /beacons
 *
 * THESE FILTERS CURRENTLY HAVE HARDCODED DUMMY DATA!!!!!
 * //[Lindsay Thurmond:10/30/14] TODO: implement real data
 * Filter options = detectedBy=[agent custom id], distance=[meters]
 * Examples
 *      /beacons?detectedBy=Kitchen
 *      /beacons?detectedBy=Kitchen&proximity=5 - nice to have, does nothing currently
 *
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {

    //[Lindsay Thurmond:10/30/14] TODO: replace filter section with real logic
    var detectedBy = req.query.detectedBy;
    var hardcoded = req.query.hardcoded; //[Lindsay Thurmond:11/3/14] TODO: temporary property for testing only
    var proximity = req.query.proximity;

    var useHardCoded = hardcoded && hardcoded === 'yes';

    // hardcoded filter logic
    if (detectedBy) {

        if (useHardCoded) {
            var beaconsToSend;
            if ('Kitchen' === detectedBy) {
                beaconsToSend = sampleData.kitchenBeacons;
            } else if ('Great Room' === detectedBy) {
                beaconsToSend = sampleData.greatRoomBeacons;
            } else if ('Lobby' === detectedBy) {
                beaconsToSend = sampleData.lobbyBeacons;
            } else {
                beaconsToSend = sampleData.otherBeacons;
            }
            return res.json(200, beaconsToSend);
        } else {
            detectionEventService.getBeaconsInRangeOfPromise(detectedBy)
                .then(function (beacons) {
                    return res.json(200, beacons);
                }, function (err) {
                    handleError(res, err);
                });
        }


    }
    // normal code for full list
    else {
        beaconService.findBeacons()
            .then(function (beacons) {
                return res.json(200, beacons);
            }, function (err) {
                return handleError(res, err);
            });
    }

};

/**
 * Get a single beacon
 * GET /beacons/:id
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
//    beaconService.findBeaconById(req.params.id)
//        .then(function (beacon) {
//            if (!beacon) {
//                return res.send(404);
//            }
//            return res.json(beacon);
//        }, function (err) {
//            return handleError(res, err);
//        });

    beaconService.findByUuid(req.params.id)
        .then(function (beacon) {
            if (!beacon) {
                return res.send(404);
            }
            return res.json(beacon);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Creates a new beacon in the DB.
 * POST /beacons
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    beaconService.createBeacon(req.body)
        .then(function (beacon) {
            return res.json(201, beacon);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Updates an existing beacon in the DB.
 * PUT /beacons/:id
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var beacon = req.body;
    beaconService.updateBeacon(beacon)
        .then(function (beacon) {
            if (!beacon) {
                return res.send(404);
            }
            return res.json(200, beacon);
        }, function (err) {
            return handleError(res, err);
        });
};


/**
 * Deletes a beacon from the DB.
 * DELETE /beacons/:id
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
    var beaconId = req.params.id;
    beaconService.deleteBeacon(beaconId)
        .then(function () {
            return res.send(204);
        }, function (err) {
            return handleError(res, err);
        });
};

function handleError(res, err) {
    return res.send(500, err);
}
