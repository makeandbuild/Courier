/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var beaconDetectionService = require('../service/beacon-detection.service');
var agentService = require('../service/agent.service');
var engineService = require('../service/engine.service');
var _ = require('lodash');

var listeningSocket;
var agentNamespace;
var engineNamespace;

var connectedEngines = {};
var connectedAgents = {};


module.exports.configure = function (socketio) {

    listeningSocket = socketio;

    updateAgentStatuses();

    //[Lindsay Thurmond:2/8/15] TODO: add authentication
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    // socketio.use(require('socketio-jwt').authorize({
    //   secret: config.secrets.session,
    //   handshake: true
    // }));

    // AGENT NAMESPACE
    agentNamespace = socketio.of('/agent');
    agentNamespace.on('connection', function(client){
        console.log('AGENT %s CONNECTED', client.id);
        connectedAgents[client.id] = {};

        // accept beacon detections
        client.on('beacondetections', function (detections) {

            // console.log(JSON.stringify(detections));
            beaconDetectionService.processNewDetectionData(detections);
        });

        client.on('register', function (data) {
            console.log('Agent registration: %s', JSON.stringify(data));
            connectedAgents[client.id] = data;

            // register agent
            agentService.createAgentWithExistingCheck(data)
                .then(function(registeredAgent){
                    console.log('Successfully registered agent: %s', JSON.stringify(registeredAgent));
                    agentNamespace.to(client.id).emit('registerSuccess', registeredAgent);
                })
                .otherwise(function(err){
                    console.log('Error registering agent. client.id: %s. %s', client.id, err);
                    agentNamespace.to(client.id).emit('registerFailure', { error: err });
                });

            updateAgentStatuses();
        });
    });

    // ENGINE NAMESPACE
    engineNamespace = socketio.of('/engine');
    engineNamespace.on('connection', function(client) {
        console.log('ENGINE %s CONNECTED!', client.id);
        connectedEngines[client.id] = {};

        client.on('register', function (data) {
            // save data - format : { capabilities : ['audio'], macAddress : '67:98:09:89' }
            console.log('Engine registration: %s', JSON.stringify(data));
            connectedEngines[client.id] = data;

            engineService.createEngineWithExistingCheck(data)
                .then(function(engine){
                    console.log('Successfully registered engine: %s', JSON.stringify(engine));
                })
                .otherwise(function(err) {
                    console.log('Error registering engine. client.id: %s. %s', client.id, err);
                });

            //[Lindsay Thurmond:2/9/15] TODO: send config params to engine (s3 url, etc)
        });
    });


    // DEFAULT NAMESPACE
    socketio.on('connection', function (client) {

        client.connectedAt = new Date();

        client.on('disconnect', function () {
            // engine
            var engineConfig = connectedEngines[client.id];
            var agentConfig = connectedAgents[client.id];
            if (engineConfig) {
                console.log('ENGINE %s DISCONNECTED', client.id);
                delete connectedEngines[client.id];
                updateEngineStatuses();
            }
            // agent
            else if (agentConfig) {
                var customId = agentConfig.customId;
                console.log('AGENT %s DISCONNECTED (customId: %s)', client.id, customId);
                delete connectedAgents[client.id];
                updateAgentStatuses();
            }
            // other
            else {
                console.log('%s DISCONNECTED', client.id);
            }
        });

        console.log('%s CONNECTED to Default Namespace', client.id);
    });
}

function broadcastToEngines(message, data) {
    engineNamespace.emit(message, data);
}

/**
 * Plays the audio currently configured for the engine
 */
function playAudioOnEngines(filename) {
    if (!filename || filename == '') {
        filename = config.engine.audio.defaultFilename;
    }

    var engineIds = _.keys(connectedEngines);
    console.log('Engine Ids %s', JSON.stringify(engineIds));
    if (engineIds) {
        engineIds.forEach(function(engineId) {
            var clientInfo = connectedEngines[engineId];
            if (clientInfo && clientInfo.capabilities) {
                if (_.indexOf(clientInfo.capabilities, 'audio') != -1) {
                    console.log('Sending actual playaudio command to engineId: %s', engineId);
                    engineNamespace.to(engineId).emit('playaudio', { filename: filename});
                }
            }
        });
    }
}

/**
 * This assume engine and agent are on the same machine (same mac address)
 *
 * @param macAddress
 * @param filename
 */
function playAudioOnEngine(macAddress, filename) {
    var engineIds = _.keys(connectedEngines);
    if (engineIds) {
        engineIds.forEach(function(engineId) {
            var clientInfo = connectedEngines[engineId];
            if (clientInfo && clientInfo.macAddress && clientInfo.macAddress === macAddress) {

                if (!filename || filename == '') {
                    filename = config.engine.audio.defaultFilename;
                }

                console.log('Sending playAudio to engineId: %s, filename: %s', engineId, filename);
                engineNamespace.to(engineId).emit('playaudio', { filename: filename });
            }
        });
    }
}


function updateAgentStatuses() {
    var connectedAgentInfos = _.values(connectedAgents);
    agentService.updateAllAgentStatus(connectedAgentInfos);
}

function updateEngineStatuses() {
    var connectedEngineInfos = _.values(connectedEngines);
    engineService.updateAllEngineStatus(connectedEngineInfos);
}

module.exports.playAudioOnEngine = playAudioOnEngine;
module.exports.playAudioOnEngines = playAudioOnEngines;
module.exports.broadcastToEngines = broadcastToEngines;
module.exports.updateAgentStatuses = updateAgentStatuses;
module.exports.updateEngineStatuses = updateEngineStatuses;
module.exports.connectedEngines = connectedEngines;