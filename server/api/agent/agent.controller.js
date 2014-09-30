/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /agents              ->  index
 * POST    /agents              ->  create
 * GET     /agents/:id          ->  show
 * PUT     /agents/:id          ->  update
 * DELETE  /agents/:id          ->  destroy
 */

'use strict';

var Agent = require('./../../models/agent.model.js');
var agentService = require('../../service/agent.service.js');

// Get list of agents
// GET /agents
exports.index = function (req, res) {
    agentService.findAgents(function (err, agents) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, agents);
    });
};

// Get a single agent
// GET /agents/:id
exports.show = function (req, res) {
    agentService.findAgentById(req.params.id, function (err, agent) {
        if (err) {
            return handleError(res, err);
        }
        if (!agent) {
            return res.send(404);
        }
        return res.json(agent);
    });
};

// Creates a new agent in the DB.
// POST /agents
exports.create = function (req, res) {
    agentService.createAgent(req.body, function (err, agent) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, agent);
    });
};

// Updates an existing agent in the DB.
// PUT /agents/:id
exports.update = function (req, res) {
    agentService.updateAgent(req.body, function (err, agent) {
        if (err) {
            return handleError(res, err);
        }
        if (!agent) {
            return res.send(404);
        }
        return res.json(200, agent);
    });
};

// Deletes an agent from the DB.
// DELETE /agents/:id
exports.destroy = function (req, res) {
    agentService.deleteAgent(req.params.id, function (err, agent) {
        if (err) {
            return handleError(res, err);
        }
        return res.send(204);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
