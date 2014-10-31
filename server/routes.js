/**
 * Main application routes
 */

'use strict';

var express = require('express')
var errors = require('./components/errors');

module.exports = function (app) {

//    app.use(function(req, res, next) {
//        res.header("Access-Control-Allow-Origin", "*");
//        res.header("Access-Control-Allow-Headers", "X-Requested-With");
//        next();
//    });

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
//        res.setHeader('Access-Control-Allow-Origin', 'http://arrontedesign.com');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-access-token,username,password,Accept');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
//        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

//    app.all('*', function(req, res, next) {
//        res.header("Access-Control-Allow-Origin", "*");
//        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//        next();
//    });

    // Insert routes below
    app.use('/api/tokens', require('./api/token'));
    app.use('/api/agents', require('./api/agent'));
    app.use('/api/beacons', require('./api/beacon'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/beacondetections', require('./api/beacon_detection'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
