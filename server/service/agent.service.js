/**
 * Service layer for agents
 */
'use strict';

var _ = require('lodash');
var when = require('when');

var Agent = require('./../models/agent.model.js');
var agentDao = require('../dao/agent.dao.js');

/**
 * Finds list of all agents
 *
 * @returns {*}
 */
exports.findAgents = function () {
    return when(agentDao.findAgentsPromise());
}

/**
 * Finds an agent by id
 *
 * @param id
 * @returns {*}
 */
exports.findAgentById = function (id) {
    return when(agentDao.findAgentByIdPromise(id));
}

exports.findAgentByCustomId = function (id) {
    return when(agentDao.findAgentByCustomIdPromise(id));
}

/**
 * Creates a single agent
 *
 * @param agent
 * @returns {*}
 */
exports.createAgent = function(agent) {
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
exports.createAgents = function(agents) {
    return when(agentDao.createAgentsPromise(agents));
}

/**
 * Updates an existing agent
 *
 * @param agent
 * @returns {*}
 */
exports.updateAgent = function (agent) {
    if (!agent) {
        return when.reject('Cannot update empty agent');
    }
    return when(agentDao.updateAgentPromise(agent));
};

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
