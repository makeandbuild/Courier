'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var Agent = require('./../models/agent.model.js');

var _this = this;

exports.findAgentsPromise = function () {
    return Agent.find().exec();
}

exports.findAgentByUnderscoreIdPromise = function findAgentByUnderscoreIdPromise(_id) {
    return Agent.findById(_id).exec();
}

exports.findAgentByCustomIdPromise = function (id) {
    return Agent.findOne({customId:id}).exec();
}

exports.findByLocationPromise = function (location) {
    // assuming there is only one
    return Agent.findOne({location:location}).exec();
}

exports.createAgentPromise = function (agent) {
    agent.lastSeen = new Date;
    agent.registered = new Date;

    if(!agent.approvedStatus)
        agent.approvedStatus='Pending'

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

exports.updateAgentPromise = function (agent) {
    var promise = new mongoose.Promise;

    var agentId;
    if (agent._id) {
        agentId = agent._id;
        delete agent._id;
    }

    _this.findAgentByUnderscoreIdPromise(agentId)
        .then(function(agentToUpdate){
            if (!agentToUpdate) {
                return promise.reject('No agent with id =' + agentId + ' found to update.');
            }
            var updated = _.merge(agentToUpdate, agent);
            updated.save(function (err) {
                if (err) {
                    return promise.reject(err);
                }
                return promise.complete(agentToUpdate);
            });
        },
        function(err){
            promise.reject(err);
        });
    return promise;
}


exports.deleteAgentByIdPromise = function (id) {
    return Agent.findById(id).remove().exec();
}

exports.deleteAllAgents = function() {
    return Agent.find({}).remove().exec();
}