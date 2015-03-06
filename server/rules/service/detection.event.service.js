'use strict';

var _ = require('lodash');
var when = require('when');
var socketio = require('../../config/socketio.js');


var rules = []

exports.registerRule  = function (ruleFunction) {
    rules.push(ruleFunction);
}

/**
 * agentId = args[0]
 * uuid = args[1]
 * major = args[2]
 * minor = args[3]
 * proximity = args[4]
 * eventType = args[5]
 *
 * @param args
 */
exports.processDetectionEvent = function (args) {

    rules.forEach(function(rule){
        rule(args);
    });

}
