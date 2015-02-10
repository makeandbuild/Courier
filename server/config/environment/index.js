'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    crossbarUrl: 'ws://127.0.0.1:8080/ws',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        jwtTokenSecret: 'COURIER_SUPER_SECRET_TOKEN'
    },

    // List of user roles (the order of these matters)
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    log: {
        beaconDetections: true // should beacon detections be logged to a file
    },

    token: {
        unitOfTime : 'days',
        amount : 30
    },

    engine: {
        defaultAudio: 'hello.mp3' // audio file to use if one hasn't been set for the beacon or agent
    }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
        require('./' + process.env.NODE_ENV + '.js') || {});
