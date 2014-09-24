'use strict';

var _ = require('lodash');
var BeaconEvent = require('./beacon-event.model');

// Get list of beaconEvents
// GET     /beaconEvents              ->  index
exports.index = function (req, res) {
  BeaconEvent.find(function (err, beaconEvents) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, beaconEvents);
  });
};

// Get a single beaconEvent
// GET     /beaconEvents/:id          ->  show
exports.show = function (req, res) {
  BeaconEvent.findById(req.params.id, function (err, beaconEvent) {
    if (err) {
      return handleError(res, err);
    }
    if (!beaconEvent) {
      return res.send(404);
    }
    return res.json(beaconEvent);
  });
};

// Creates a new beaconEvent in the DB.
// POST    /beaconEvents              ->  create
exports.create = function (req, res) {
  BeaconEvent.create(req.body, function (err, beaconEvent) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, beaconEvent);
  });
};

// Updates an existing beaconEvent in the DB.
// PUT     /beaconEvents/:id          ->  update
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  BeaconEvent.findById(req.params.id, function (err, beaconEvent) {
    if (err) {
      return handleError(res, err);
    }
    if (!beaconEvent) {
      return res.send(404);
    }
    var updated = _.merge(beaconEvent, req.body);
    beaconEvent.markModified('properties');
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, beaconEvent);
    });
  });
};

// Deletes a beaconEvent from the DB.
// DELETE  /beaconEvents/:id          ->  destroy
exports.destroy = function (req, res) {
  BeaconEvent.findById(req.params.id, function (err, beaconEvent) {
    if (err) {
      return handleError(res, err);
    }
    if (!beaconEvent) {
      return res.send(404);
    }
    beaconEvent.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
