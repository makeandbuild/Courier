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
var Beacon = require('./beacon.model');

// Get list of beacons
// GET /beacons
exports.index = function(req, res) {
  Beacon.find(function (err, beacons) {
    if (err) { return handleError(res, err); }
    return res.json(200, beacons);
  });
};

// Get a single beacon
// GET /beacons/:id
exports.show = function(req, res) {
  Beacon.findById(req.params.id, function (err, beacon) {
    if (err) { return handleError(res, err); }
    if ( ! beacon) { return res.send(404); }
    return res.json(beacon);
  });
};

// Creates a new beacon in the DB.
// POST /beacons
exports.create = function(req, res) {
  Beacon.create(req.body, function(err, beacon) {
    if (err) { return handleError(res, err); }
    return res.json(201, beacon);
  });
};

// Updates an existing beacon in the DB.
// PUT /beacons/:id
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Beacon.findById(req.params.id, function (err, beacon) {
    if (err) { return handleError(res, err); }
    if( ! beacon) { return res.send(404); }
    var updated = _.merge(beacon, req.body);
    beacon.markModified('properties');
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, beacon);
    });
  });
};

// Deletes a beacon from the DB.
// DELETE /beacons/:id
exports.destroy = function(req, res) {
  Beacon.findById(req.params.id, function (err, beacon) {
    if (err) { return handleError(res, err); }
    if ( ! beacon) { return res.send(404); }
    beacon.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
