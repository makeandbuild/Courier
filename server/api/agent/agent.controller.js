'use strict';

var agentService = require('../../service/agent.service.js');
var socketio = require('../../config/socketio');

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
 * Get a single agent - id is the custom id for the agent (probably the mac address), not the mongo id
 * GET /agents/:id
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
//    var agentId = req.params.id;
//    agentService.findAgentById(agentId)
//        .then(function (agent) {
//            if (!agent) {
//                return res.send(404);
//            }
//            return res.json(agent);
//        }, function (err) {
//            return handleError(res, err);
//        });
    var agentId = req.params.id;

    agentService.findAgentByCustomId(agentId)
        .then(function (agentFound) {
            if (!agentFound) {
                return res.json(404, 'Unable to find agent');
            }
            return res.json(200, agentFound._doc);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Creates a new agent in the DB.
 * POST /agents
 *
 * Example:
 * {
 *   "customId": "00:0a:95:9d:68:16",
 *   "name": "Agent 1",
 *   "location": "entry way",
 *   "capabilities": ["audio"],
 *   "approvedStatus": "Pending",
 *   "operationalStatus": "Success",
 *   "lastSeenBy": "77876565",
 *   "lastSeen": "2014-10-06T15:56:43.793Z",
 *   "registered": "2014-10-01T15:56:43.793Z,
 *   "audio": {
 *      "filename":"sogood.wav"
 *   }
 * }
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    var agent = req.body;

    if (!agent.customId) {
        return res.json(403, 'Validation failure: Cannot register agent without a customId');
    }
    //[Lindsay Thurmond:2/16/15] TODO: move business logic to agent.service.js
    agentService.findAgentByCustomId(agent.customId)
        .then(function (agentFound) {
            if (!agentFound) {
                console.log("Agent not found, creating with custom id: " + agent.customId);
                agentService.createAgent(agent).then(function (agent) {
                    socketio.updateAgentStatuses();
                    res.json(201, agent);
                }).catch(function (err) {
                    res.json(400, {
                        message: 'Error creating new agent',
                        error: err
                    })
                });
            } else {
                console.log('Existing agent found with customId: %s.  Attempting to update.', agent.customId);
                agentFound.location = agent.location;
                agentFound.name = agent.name;
                agentFound.customId = agent.customId;
                agentFound.ipAddress = agent.ipAddress;
                // we don't want to update the range every time the agent is restarted
//                agentFound.range = agent.range;
                agentService.updateAgent(agentFound)
                    .then(function (agent) {
                        socketio.updateAgentStatuses();
                        res.json(200, agent);
                    }).catch(function (err) {
                        res.json(400, {
                            message: "Error updating existing agent",
                            error: err
                        })
                    })
            }
        }).catch(function (error) {
            res.json(400, {message: 'Unexpected error registering agent', error: error});
            console.log("Unexpected error registering agent: " + error);
        });
};

exports.findByCustomId = function(req, res){
    var agent = req.body;
    var customId = agent.customId;

    agentService.findAgentByCustomId(customId)
        .then(function (agentFound) {
            if (!agentFound){
                res.json(400, {
                    message: "unable to find agent",
                    error: err
                });
            }else {
                res.json(200, agent);
            }
        })
}

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
