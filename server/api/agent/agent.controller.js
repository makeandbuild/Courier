/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /agents              ->  index
 * POST    /agents              ->  create
 * GET     /agents/:id          ->  show
 * PUT     /agents/:id          ->  update
 * DELETE  /agents/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Agent = require('./agent.model');

// Get list of agents
// GET /agents
exports.index = function(req, res) {
  Agent.find(function (err, agents) {
    if (err) { return handleError(res, err); }
    return res.json(200, agents);
  });
};

// Get a single agent
// GET /agents/:id
exports.show = function(req, res) {
  Agent.findById(req.params.id, function (err, agent) {
    if (err) { return handleError(res, err); }
    if ( ! agent) { return res.send(404); }
    return res.json(agent);
  });
};

// Creates a new agent in the DB.
// POST /agents
exports.create = function(req, res) {
  Agent.create(req.body, function(err, agent) {
    if (err) { return handleError(res, err); }
    return res.json(201, agent);
  });
};

// Updates an existing agent in the DB.
// PUT /agents/:id
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Agent.findById(req.params.id, function (err, agent) {
    if (err) { return handleError(res, err); }
    if( ! agent) { return res.send(404); }
    var updated = _.merge(agent, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, agent);
    });
  });
};

// Deletes a agent from the DB.
// DELETE /agents/:id
exports.destroy = function(req, res) {
  Agent.findById(req.params.id, function (err, agent) {
    if (err) { return handleError(res, err); }
    if ( ! agent) { return res.send(404); }
    agent.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
