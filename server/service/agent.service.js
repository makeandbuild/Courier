/**
 * Service layer for agents
 */
'use strict';

var _ = require('lodash');
var when = require('when');

var Agent = require('./../models/agent.model.js');
var agentDao = require('../dao/agent.dao.js');

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
    //[Lindsay Thurmond:10/1/14] TODO: check for existing agents first - ids will be mac addresses
    //[Lindsay Thurmond:10/1/14] TODO: add registrationDate to json in mongo
    return when(agentDao.createAgentPromise(agent));

    //[Lindsay Thurmond:10/1/14] TODO: if already exists - set saved approved status, otherwise unapproved
};

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

exports.updateAllAgentStatus = function updateAgentStatus(connectedAgents) {

    var connectedAgentInfos = _.values(connectedAgents);
    var connectedCustomIds = [];
    _.forEach(connectedAgentInfos, function(info) {
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
