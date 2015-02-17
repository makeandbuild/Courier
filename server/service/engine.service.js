/**
 * Service layer for agents
 */
'use strict';

var _ = require('lodash');
var when = require('when');

var Engine = require('./../models/engine.model');
var engineDao = require('../dao/engine.dao');
var socketio = require('../config/socketio');

var _this = this;

/**
 * Finds list of all engines
 *
 * @returns {*}
 */
exports.findEngines = function findEngines() {
    return when(engineDao.findEnginesPromise());
}

/**
 * Creates a single engine
 *
 * @param engine
 */
exports.createEngine = function createEngine(engine) {
    return when(engineDao.createEnginePromise(engine));
}

exports.createEngineWithExistingCheck = function(engine) {
    var defer = when.defer();
    _this.findEngineByMacAddress(engine.macAddress)
        .then(function(foundEngine) {

            if (!foundEngine) {
                console.log('Engine not found.  Creating new engine with macAddress %s', engine.macAddress);
                _this.createEngine(engine)
                    .then(function(engine) {
                        socketio.updateEngineStatuses();
                        defer.resolve(engine);
                    }, function(err){
                        console.log('Error creating new engine: %s', err);
                        defer.reject(err);
                    });

            } else {
                console.log('Existing engine found with macAddress %s.  Updating engine.', engine.macAddress);
                foundEngine.location = engine.location;
                foundEngine.name = engine.name;
                foundEngine.ipAddress = engine.ipAddress;
                foundEngine.capabilities = engine.capabilities;
                _this.updateEngine(foundEngine)
                    .then(function(engine) {
                        socketio.updateEngineStatuses();
                        defer.resolve(engine);
                    })
                    .otherwise(function(err) {
                        defer.reject(err);
                    });
            }

        },
        function(err){
            defer.reject(err);
        });

    return defer.promise;
}

exports.findEngineByMacAddress = function findEngineByMacAddress(macAddress) {
    return when(engineDao.findEngineByMacAddressPromise(macAddress));
}

exports.updateEngine = function updateEngine(engine) {
    if (!engine) {
        return when.reject('Cannot update empty engine');
    }
    return when(engineDao.updateEnginePromise(engine));
}

/**
 *
 * @param connectedEngines array of engines that are connected
 */
exports.updateAllEngineStatus = function updateAllEngineStatus(connectedEngines) {

    var connectedMacAddresses = [];
    _.forEach(connectedEngines, function(engine) {
        if (engine.macAddress) {
            connectedMacAddresses.push(engine.macAddress);
        }
    });

    _this.findEngines()
        .then(function(engines){
            _.forEach(engines, function(engine){
                var originalStatus = engine.operationalStatus;
                if (_.indexOf(connectedMacAddresses, engine.macAddress) != -1) {
                    engine.operationalStatus = 'Success';
                } else {
                    engine.operationalStatus = 'Failure';
                }
                if (originalStatus !== engine.operationalStatus) {
                    _this.updateEngine(engine);
                }
            });
        });
}