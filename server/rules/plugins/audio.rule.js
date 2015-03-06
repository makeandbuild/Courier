'use strict';

var _ = require('lodash');
var when = require('when');
var beaconService = require('../../service/beacon.service');
var agentService = require('../../service/agent.service');
var socketio = require('../../config/socketio');
var detectionEventService = require('../service/detection.event.service')

/**
 * Keeps track of the last time an enter event was seen for a beacon for a particular agent.
 *
 * Dictionary key = agentId:uuid:major:minor
 * Dictionary value = timestamp in ms
 *
 *
 * @type {{}}
 */
var lastTimeBeaconEnterSoundPlayed = {};

exports.register = function() {
    detectionEventService.registerRule(function (args) {

        var agentId = args[0];
        var uuid = args[1];
        var major = args[2];
        var minor = args[3];
        var proximity = args[4];
        var eventType = args[5];

        notifyEngine(agentId, uuid, major, minor, eventType);

    });
}

function createBeaconUniqueKey(uuid, major, minor) {
    return uuid + ':' + major + ':' + minor;
}

function notifyEngine(agentId, uuid, major, minor, eventType) {

    // play audio on the agent that detected the beacon
    if ('enter' === eventType) {

        var playSound = true;
        // if we haven't played the enter noise in the last 10 seconds then we can play it
        var key = agentId + ':' + uuid + ':' + major + ':' + minor;
        var lastPlayed = lastTimeBeaconEnterSoundPlayed[key];
        if (lastPlayed) {
            // check if we played in last 10 seconds
            var now = Date.now();
            var tenSecondsAgo = now - (10 * 1000);
            // ok play sound if the last time we played the sound was more than 10 seconds ago
            playSound = lastPlayed < tenSecondsAgo;
            if (!playSound) {
                console.log('Enter event for %s, but sound was played within the last 10 seconds.  Not playing again.', key);
            }
        }

        if (playSound) {
            var beaconKey = createBeaconUniqueKey(uuid, major, minor);
            lookupAudio(agentId, beaconKey)
                .then(function (filename) {

                    // update last play time
                    lastTimeBeaconEnterSoundPlayed[key] = Date.now();
                    console.log('Calling playAudioOnEngine - AgentId: %s, Filename: %s', agentId, filename);
                    socketio.playAudioOnEngines(filename);

                }, function (err) {
                    console.log('Error sending play audio command: ' + err);
                });
        }
    }
}

/**
 *
 * @param agentId agent that detected the beacon
 * @param beaconKey beacon that was detected
 * @returns {When.Promise<T>} promise containing the filename of the audio file
 */
function lookupAudio(agentId, beaconKey) {
    var defer = when.defer();

    beaconService.findByUniqueKey(beaconKey)
        .then(function(beacon){

            var foundFilename  = false;

            if (beacon && beacon.audio) {
                var filename = beacon.audio.filename;
                if (filename && filename != '') {
                    foundFilename = true;
                    defer.resolve(filename);
                }
            }

            if (!foundFilename) {
                // check for agent default
                agentService.findAgentByCustomId(agentId)
                    .then(function (agent) {
                        if (agent && agent.audio) {
                            defer.resolve(agent.audio.filename);
                        } else {
                            // we didn't find anything, just send an empty filename
                            console.log('DID NOT FIND AUDIO');
                            defer.resolve('');
                        }
                    }, function (err) {
                        defer.reject(err);
                    });
            }

        }, function(err){
            console.log('Error looking up filename: %s', err);
            defer.reject(err);
        });

    return defer.promise;
}