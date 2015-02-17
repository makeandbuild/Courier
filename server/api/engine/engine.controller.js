'use strict';

var engineService = require('../../service/engine.service');
var socketio = require('../../config/socketio');
var _ = require('lodash');

/**
 * Get list of engines
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

    engineService.findEngines()
        .then(function(engines){
            return res.json(200, engines);
        })
        .otherwise(function(err){
            return handleError(res, err);
        });
};

/**
 * Creates/registers an engine.
 *
 * @param req
 * @param res
 * @returns {*}
 */
exports.create = function (req, res) {

    var engine = req.body;

    if (_.keys(engine).length === 0) {
        return res.json(403, { error : 'Cannot create empty engine' });
    }

    engineService.createEngineWithExistingCheck(engine)
        .then(function(engine){
            res.json(201, engine);
        })
        .otherwise(function(err) {
           res.json(400, {error: err});
        });
}

function handleError(res, err) {
    return res.send(500, err);
}
