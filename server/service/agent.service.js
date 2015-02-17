/**
 * Service layer for agents
 */
'use strict';

var _ = require('lodash');
var when = require('when');

var Agent = require('./../models/agent.model');
var agentDao = require('../dao/agent.dao');
var socketio = require('../config/socketio');

var _this = this;

/**
 * Finds list of all agents
 *
 * @returns {*}
 */
exports.findAgents = function findAgents() {
    return when(agentDao.findAgentsPromise());
}

/**
 * Finds an agent by _id
 *
 * @param _id
 * @returns {*}
 */
exports.findAgentByUnderscoreId = function findAgentByUnderscoreId(_id) {
    return when(agentDao.findAgentByUnderscoreIdPromise(_id));
}

exports.findAgentByCustomId = function findAgentByCustomId(customId) {
    return when(agentDao.findAgentByCustomIdPromise(customId));
}

exports.findByLocation = function findByLocation(location) {
    return when(agentDao.findByLocationPromise(location));
}

/**
 * Creates a single agent
 *
 * @param agent
 * @returns {*}
 */
exports.createAgent = function createAgent(agent) {
    //[Lindsay Thurmond:10/1/14] TODO: add registrationDate to json in mongo
    return when(agentDao.createAgentPromise(agent));
};

exports.createAgentWithExistingCheck = function(agent) {
    var defer = when.defer();

    if (!agent.customId) {
        return when.reject('Validation failure: Cannot create/register agent without a customId');
    }
    _this.findAgentByCustomId(agent.customId)
        .then(function (agentFound) {
            if (!agentFound) {
                console.log("Agent not found, creating with custom id: " + agent.customId);
                _this.createAgent(agent)
                    .then(function (agent) {
                        socketio.updateAgentStatuses();
                        defer.resolve(agent);
                    })
                    .otherwise(function (err) {
                        defer.reject(err);
                    });
            } else {
                console.log('Existing agent found with customId: %s.  Attempting to update.', agent.customId);
                agentFound.location = agent.location;
                agentFound.name = agent.name;
                agentFound.customId = agent.customId;
                agentFound.ipAddress = agent.ipAddress;
                // we don't want to update the range every time the agent is restarted
//                agentFound.range = agent.range;
                _this.updateAgent(agentFound)
                    .then(function (agent) {
                        socketio.updateAgentStatuses();
                        defer.resolve(agent);
                    })
                    .otherwise(function (err) {
                        defer.reject(err);
                    });
            }
        })
        .otherwise(function (error) {
            console.log("Unexpected error registering agent: " + error);
            defer.reject(error);
        });
    return defer.promise;
}

/**
 * Creates all agents in array
 *
 * @param agents
 * @returns {*}
 */
exports.createAgents = function createAgents(agents) {
    return when(agentDao.createAgentsPromise(agents));
}

/**
 * Updates an existing agent
 *
 * @param agent
 * @returns {*}
 */
exports.updateAgent = function updateAgent(agent) {
    if (!agent) {
        return when.reject('Cannot update empty agent');
    }
    return when(agentDao.updateAgentPromise(agent));
};

/**
 *
 * @param connectedAgents array of agents that are connected
 */
exports.updateAllAgentStatus = function updateAgentStatus(connectedAgents) {

    var connectedCustomIds = [];
    _.forEach(connectedAgents, function(info) {
        if (info.customId) {
            connectedCustomIds.push(info.customId);
        }
    });

    _this.findAgents()
        .then(function(agents){
            _.forEach(agents, function(agent){
                var originalStatus = agent.operationalStatus;
                if (_.indexOf(connectedCustomIds, agent.customId) != -1) {
                    agent.operationalStatus = 'Success';
                } else {
                    agent.operationalStatus = 'Failure';
                }
                if (originalStatus !== agent.operationalStatus) {
                    _this.updateAgent(agent);
                }
            });
        });

}

/**
 * Deletes an agent
 */
exports.deleteAgent = function (id) {
    return when(agentDao.deleteAgentByIdPromise(id));
};

/**
 * Deletes all agents
 *
 * @returns {*}
 */
exports.deleteAllAgents = function () {
    return when(agentDao.deleteAllAgents());
};
