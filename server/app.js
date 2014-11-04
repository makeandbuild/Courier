/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var when = require('when');

// open wamp connection
//require('./service/event.publisher.service.js').openConnection();
// init wamp listeners
//require('./rules/service/event.subscription.service.js').registerListeners();

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);


// Setup server
var app = express();

// Populate DB with sample data
var promiseMongoSeedComplete = when.promise(function(resolve, reject, notify) {
    if (config.seedDB) {
        var seed = require('./config/seed');
        seed(function() {
            resolve("Data loaded!");
        });
    }
});
app.mongoReadyPromise = promiseMongoSeedComplete;

var server = require('http').createServer(app);
var socketio = require('socket.io').listen(server);
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

try {
// Start server
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
} catch (e) {
    console.log('Error starting up server: ' + e);
}

// Expose app
exports = module.exports = app;