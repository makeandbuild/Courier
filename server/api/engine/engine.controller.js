'use strict';

var engineService = require('../../service/engine.service');
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

exports.show = function findByMacAddress(req, res){
    var macAddress = req.params.id;

    engineService.findEngineByMacAddress(macAddress)
        .then(function (foundEngine) {
            if (!foundEngine){
                res.json(404, 'Unable to find engine with macAddress: ' + macAddress);
            } else {
                res.json(200, foundEngine);
            }
        })
        .otherwise(function(err) {
           handleError(res, err);
        });
}

/**
 * Updates an existing engine in the DB.
 * PUT /engine/:id
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var engine = req.body;
    engineService.updateEngine(engine)
        .then(function (updatedEngine) {
            if (!updatedEngine) {
                return res.send(404);
            }
            return res.json(200, updatedEngine);
        })
        .otherwise(function (err) {
            return handleError(res, err);
        });
};

/**
 * Deletes an engine from the database using the mongo _id
 * DELETE /engine/:id
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
    var engineId = req.params.id;
    engineService.deleteEngine(engineId)
        .then(function () {
            return res.send(204);
        })
        .otherwise(function (err) {
            return handleError(res, err);
        });
};

function handleError(res, err) {
    return res.send(500, err);
}
