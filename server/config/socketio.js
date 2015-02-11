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

//[Lindsay Thurmond:2/9/15] TODO: expose rest/socket call for list of connected engines for ui
var connectedEngines = {};
var connectedAgents = []; //[Lindsay Thurmond:2/9/15] TODO: update active agent status in mongo


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
        console.log('AGENT %s CONNECTED', client.id);
        connectedAgents.push(client.id);

        // accept beacon detections
        client.on('beacondetections', function (detections) {

            // console.log(JSON.stringify(detections));
            beaconDetectionService.processNewDetectionData(detections);
        });
    });

    // ENGINE NAMESPACE
    engineNamespace = socketio.of('/engine');
    engineNamespace.on('connection', function(client) {
        console.log('ENGINE %s CONNECTED!', client.id);
        connectedEngines[client.id] = {};

        client.on('register', function (data) {
            // save data - format : { capabilities : ['audio'], macAddress : '67:98:09:89' }
            console.log('Enging registration: %s', JSON.stringify(data));
            connectedEngines[client.id] = data;
            //[Lindsay Thurmond:2/9/15] TODO: send config params to engine (s3 url, etc)
        });
    });


    // DEFAULT NAMESPACE
    socketio.on('connection', function (client) {

        client.connectedAt = new Date();

        client.on('disconnect', function () {
            // engine
            var engineConfig = connectedEngines[client.id];
            if (engineConfig) {
                console.log('ENGINE %s DISCONNECTED', client.id);
                delete connectedEngines[client.id];
            }
            // agent
            else if (_.indexOf(connectedAgents, client.id) != -1) {
                connectedAgents = _.without(connectedAgents, client.id);
                console.log('AGENT %s DISCONNECTED', client.id);
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
//function playAudioOnEngines() {
//    var engineIds = _.keys(connectedEngines);
//    if (engineIds) {
//        engineIds.forEach(function(engineId) {
//            var clientInfo = connectedEngines[engineId];
//            if (clientInfo && clientInfo.capabilities) {
//                if (_.indexOf(clientInfo.capabilities, 'audio') != -1) {
//                    //[Lindsay Thurmond:2/8/15] TODO: look up actual file names
//                    engineNamespace.to(engineId).emit('playaudio', { filename: 'sogood.wav'});
//                }
//            }
//        });
//    }
//}

function playAudioOnEngine(macAddress, filename) {

    var engineIds = _.keys(connectedEngines);
    if (engineIds) {
        engineIds.forEach(function(engineId) {
            var clientInfo = connectedEngines[engineId];
            if (clientInfo && clientInfo.macAddress && clientInfo.macAddress === macAddress) {

                if (!filename || filename == '') {
                    filename = config.engine.audio.defaultFilename;
                }

                console.log('Sending playAudio to engienId: %s, filename: %s', engineId, filename);
                engineNamespace.to(engineId).emit('playaudio', { filename: filename });
            }
        });
    }

}

module.exports.playAudioOnEngine = playAudioOnEngine;
//module.exports.playAudioOnEngines = playAudioOnEngines;
module.exports.broadcastToEngines = broadcastToEngines;



