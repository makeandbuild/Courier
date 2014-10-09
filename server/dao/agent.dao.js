'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var Agent = require('./../models/agent.model.js');

exports.findAgentsPromise = function () {
    return Agent.find().exec();
}

exports.findAgentByIdPromise = function (id) {
    return Agent.findById(id).exec();
}

exports.createAgentPromise = function (agent) {
    return Agent.create(agent); // returns a promise without needing .exec()
};

exports.createAgentsPromise = function(agents) {
    var promise = new mongoose.Promise;
    Agent.create(agents, function() {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if(err) {
            return promise.reject(err);
        }

        var savedAgents = [];
        for (var i = 1; i < arguments.length; i++) {
            var savedAgent = arguments[i];
            savedAgents.push(savedAgent);
        }
        promise.complete(savedAgents);
    });
    return promise;
}

//[Lindsay Thurmond:10/8/14] TODO:  there has to be a better way to do this
exports.updateAgentPromise = function (agent) {
    var promise = new mongoose.Promise;

    var agentId;
    if (agent._id) {
        agentId = agent._id;
        delete agent._id;
    }
    Agent.findById(agentId, function (err, agentToUpdate) {
        if (err) {
            return promise.reject(err);
        }
        if (!agentToUpdate) {
            return promise.reject('No agent with id=' + agentId + ' found to update.');
        }
        var updated = _.merge(agentToUpdate, agent);
        updated.save(function (err) {
            if (err) {
                return promise.reject(err);
            }
            return promise.complete(agentToUpdate);
        });
    });
    return promise;
}


exports.deleteAgentByIdPromise = function (id) {
    return Agent.findById(id).remove().exec();
}

exports.deleteAllAgents = function() {
    return Agent.find({}).remove().exec();
}