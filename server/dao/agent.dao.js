'use strict';

var Agent = require('./../models/agent.model.js');
var mongoose = require('mongoose');

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
