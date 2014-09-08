/**
 * POST    /ping              ->  ping
 */

'use strict';

var _ = require('lodash');
var Agent = require('../agent/agent.model');
var winston = require('winston');
//var Beacon = require('./beacon.model');

// Creates a new beacon in the DB.
exports.ping_mode1 = function(req, res) {

    console.log(req.body);

    var options = {
        maxsize: 1000
    }

    //convert incoming json to log line to append to file


    var logLine = "" + req.body;

    //TODO: save ping to log file.
    winston.add(winston.transports.File, { filename: '/tmp/somefile.log' });
    winston.remove(winston.transports.Console);
    winston.log('info', logLine, options);

    //TODO: convert incoming json to agent post
    var agentInfo = "{ 'id':'" + req.body.agent + "', 'api-key': " + req.body.api-key + "', 'lastSeen':" + new Date();

    //TODO: update agent with new heartbeat (time + id)
    // Updates an existing agent in the DB.
    exports.update = function(req, res) {
        if(req.body._id) { delete req.body._id; }
        Agent.findById(req.params.id, function (err, agent) {

            if (err) { return handleError(res, err); }

            if( ! agent) { return res.send(404); }

            var updated = _.merge(agent, req.body);

            updated.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json(200, agent);
            });
        });
    };
	res.send(200, 'ok');
};