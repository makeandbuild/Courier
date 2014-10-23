'use strict';

var beaconService = require('../../service/beacon.service.js');

/**
 * Get list of beacons
 * GET /beacons
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    beaconService.findBeacons()
        .then(function (beacons) {
            return res.json(200, beacons);
        }, function (err) {
            return handleError(res, err);
        });
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
