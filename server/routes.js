/**
 * Main application routes
 */

'use strict';

var express = require('express')
var errors = require('./components/errors');
//var cors = require('./auth/middleware/cors.js');

module.exports = function (app) {

//    app.use(cors);

    // Insert routes below
    app.use('/api/tokens', require('./api/token'));
    app.use('/api/agents', require('./api/agent'));
    app.use('/api/beacons', require('./api/beacon'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/beacondetections', require('./api/beacon_detection'));
    app.use('/api/engines', require('./api/engine'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
