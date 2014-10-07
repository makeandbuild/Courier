/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /beacons              ->  index
 * POST    /beacons              ->  create
 * GET     /beacons/:id          ->  show
 * PUT     /beacons/:id          ->  update
 * DELETE  /beacons/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Beacon = require('./../../models/beacon.model.js');
var beaconService = require('../../service/beacon.service.js');

// Get list of beacons
// GET /beacons
exports.index = function (req, res) {
    beaconService.findBeacons(function (err, beacons) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, beacons);
    });
};

// Get a single beacon
// GET /beacons/:id
exports.show = function (req, res) {
    beaconService.findBeaconById(req.params.id, function (err, beacon) {
        if (err) {
            return handleError(res, err);
        }
        if (!beacon) {
            return res.send(404);
        }
        return res.json(beacon);
    });
};

// Creates a new beacon in the DB.
// POST /beacons
exports.create = function (req, res) {
    beaconService.createBeacon(req.body, function (err, beacon) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, beacon);
    });
};

// Updates an existing beacon in the DB.
// PUT /beacons/:id
exports.update = function (req, res) {
    beaconService.updateBeacon(req.body, function (err, beacon) {
        if (err) {
            return handleError(res, err);
        }
        if (!beacon) {
            return res.send(404);
        }
        return res.json(200, beacon);
    });
};

// Deletes a beacon from the DB.
// DELETE /beacons/:id
exports.destroy = function (req, res) {
    beaconService.deleteBeacon(req.params.id, function (err, beacon) {
        if (err) {
            return handleError(res, err);
        }
        return res.send(204);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
