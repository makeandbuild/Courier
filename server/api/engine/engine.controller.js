'use strict';

//var engineService = require('../../service/engine.service.js');
var socketio = require('../../config/socketio');
var _ = require('lodash');

/**
 * Get list of agents
 * GET /engines
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {

    // capabilities : config.capabilities,
    // macAddress : macAddress,
    // name : config.name,
    // location : config.location

    //[Lindsay Thurmond:2/11/15] TODO: this is cheating - we need to start saving engines to the database
    var connectedEngines = socketio.connectedEngines;
    var engines = _.values(connectedEngines);

    return res.json(200, engines);
};

function handleError(res, err) {
    return res.send(500, err);
}
