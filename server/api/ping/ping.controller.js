/**
 * POST    /ping              ->  ping
 */

'use strict';

var _ = require('lodash');
var Agent = require('../agent/agent.model');
var winston = require('winston');
//var Beacon = require('./beacon.model');
var logConfig = require('../../config/config.log.json');

// can only add a transport once, so do it outside of the function
winston.add(winston.transports.File, { name: 'log.info', filename: logConfig.path + '/pings.log', level: 'info' });
winston.remove(winston.transports.Console);

// Creates a new beacon in the DB.
exports.ping_mode1 = function(req, res) {

    console.log(req.body);

    var options = {
        maxsize: 1000
    }

    //convert incoming json to log line to append to file
    var logLine = "" + req.body;

    //save ping to log file
    winston.log('info', logLine, options);

    //convert incoming json to agent post
    var agentInfo = "{ 'id':'" + req.body.agent + "', 'apikey': " + req.body.apikey + "', 'lastSeen':" + new Date();

    //TODO: update agent with new heartbeat (time + id)
    // Updates an existing agent in the DB.
    exports.update = function(req, res) {
        if(req.body._id) { delete req.body._id; }
        Agent.findById(req.params.id, function (err, agent) {

            if (err) { return handleError(res, err); }

            if( ! agent) { return res.send(404); }

            var updated = _.merge(agent, agentInfo);

            updated.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json(200, agent);
            });
        });
    };
	res.send(200, 'ok');
};