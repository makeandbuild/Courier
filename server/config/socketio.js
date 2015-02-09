/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var beaconDetectionService = require('../service/beacon-detection.service');
var _ = require('lodash');

var listeningSocket;
var agentNamespace;
var engineNamespace;

var connectedEngines = {};
//var connectedAgents = {};


module.exports.configure = function (socketio) {

    listeningSocket = socketio;

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

        console.info('Agent [%s] CONNECTED', client.id);

        // accept beacon detections
        client.on('beacondetections', function (detections) {

            // console.log(JSON.stringify(detections));
            beaconDetectionService.processNewDetectionData(detections);
        });
    });

    // ENGINE NAMESPACE
    engineNamespace = socketio.of('/engine');
    engineNamespace.on('connection', function(client) {
        console.info('Engine [%s] connected!', client.id);
        connectedEngines[client.id] = {};

        client.on('register', function (data) {
            // save info
            connectedEngines[client.id] = data;
        });
    });


    // DEFAULT NAMESPACE
    socketio.on('connection', function (client) {

        client.connectedAt = new Date();

        client.on('disconnect', function () {
            delete connectedEngines[client.id];

            console.info('[%s] DISCONNECTED', client.id);
        });

        console.info('[%s] CONNECTED', client.id);
    });
}

function broadcastToEngines(message, data) {
    engineNamespace.emit(message, data);
}

/**
 * Plays the audio currently configured for the engine
 */
function playAudioOnEngines() {
//    for (var clientId in listeningSocket.engine.clients) {

    var engineIds = _.keys(connectedEngines);

    if (engineIds) {

        engineIds.forEach(function(engineId) {
            var clientInfo = connectedEngines[engineId];
            if (clientInfo && clientInfo.capabilities) {
                if (_.indexOf(clientInfo.capabilities, 'audio') != -1) {
                    //[Lindsay Thurmond:2/8/15] TODO: look up actual file names
                    engineNamespace.to(engineId).emit('playaudio', { filename: 'sogood.wav'});
                }
            }
        });
    }
}

module.exports.playAudioOnEngines = playAudioOnEngines;
module.exports.broadcastToEngines = broadcastToEngines;



