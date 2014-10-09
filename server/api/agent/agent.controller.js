'use strict';

var Agent = require('./../../models/agent.model.js');
var agentService = require('../../service/agent.service.js');

/**
 * Get list of agents
 * GET /agents
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    agentService.findAgents()
        .then(function (agents) {
            return res.json(200, agents);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Get a single agent
 * GET /agents/:id
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
    var agentId = req.params.id;
    agentService.findAgentById(agentId)
        .then(function (agent) {
            if (!agent) {
                return res.send(404);
            }
            return res.json(agent);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Creates a new agent in the DB.
 * POST /agents
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    var agent = req.body;
    agentService.createAgent(agent)
        .then(function (agent) {
            return res.json(201, agent);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Updates an existing agent in the DB.
 * PUT /agents/:id
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var agent = req.body;
    agentService.updateAgent(agent)
        .then(function (agent) {
            if (!agent) {
                return res.send(404);
            }
            return res.json(200, agent);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Deletes an agent from the DB.
 * DELETE /agents/:id
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
    var agentId = req.params.id;
    agentService.deleteAgent(agentId)
        .then(function () {
            return res.send(204);
        }, function (err) {
            return handleError(res, err);
        });
};

function handleError(res, err) {
    return res.send(500, err);
}
