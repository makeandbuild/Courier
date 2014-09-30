/**
 * Service layer for agents
 */
'use strict';

var _ = require('lodash');
var Agent = require('./../models/agent.model.js');


exports.findAgents = function (callback) {
    Agent.find(callback);
}


exports.findAgentById = function (id, callback) {
    Agent.findById(id, callback);
}

exports.createAgent = function(agent, callback) {
    Agent.create(agent, callback);
};

// Updates an existing agent in the DB
exports.updateAgent = function (agent, callback) {
    if (!agent) {
        callback('Cannot update empty agent');
    }
    var agentId;
    if (agent._id) {
        agentId = agent._id;
        delete agent._id;
    }
    Agent.findById(agentId, function (err, agentToUpdate) {
        if (err) {
            return callback(err);
        }
        if (!agentToUpdate) {
            return callback(err);
        }
        var updated = _.merge(agentToUpdate, agent);
        updated.save(function (err) {
            if (err) {
                return callback(err);
            }
            return callback(null, agentToUpdate);
        });
    });
};

// Deletes an agent from the DB
exports.deleteAgent = function (id, callback) {
    Agent.findById(id, function (err, agentToDelete) {
        if (err) {
            return callback(err);
        }
        if (!agentToDelete) {
            callback(err);
        }
        agentToDelete.remove(function (err) {
            if (err) {
                callback(err);
            }
            return callback();
        });
    });
};
