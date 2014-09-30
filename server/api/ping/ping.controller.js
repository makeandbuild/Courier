/**
 * POST    /pings              ->  ping
 */

'use strict';

var _ = require('lodash');
var Agent = require('../../models/agent.model.js');
var config = require('../../config/environment');
var logger = require('../../utils/logger.js');
//var agentService = require('../../service/agent.service.js');


// POST /api/pings
// send single ping
exports.ping_mode1 = function (req, res) {

    console.log(req.body);

    //convert incoming json to log line to append to file
    var logLine = JSON.stringify(req.body);

    //save ping to log file
    logger.pings(logLine);

    //convert incoming json to agent post
//    var agentInfo = "{ 'id':'" + req.body.agent + "', 'apikey': " + req.headers['x-auth-token'] + "', 'lastSeen':" + new Date();
//    var agentInfo = "{ 'id':'" + req.body.agent + "', 'lastSeen':" + new Date();
//
//    //TODO: update agent with new heartbeat (time + id)
//    // Updates an existing agent in the DB.
//    exports.update = function (req, res) {
//        if (req.body._id) {
//            delete req.body._id;
//        }
//        Agent.findById(req.params.id, function (err, agent) {
//            if (err) {
//                return handleError(res, err);
//            }
//            if (!agent) {
//                return res.send(404);
//            }
//            var updatedAgent = _.merge(agent, agentInfo);
//            updatedAgent.save(function (err) {
//                if (err) {
//                    return handleError(res, err);
//                }
//                return res.json(200, agent);
//            });
//        });
//    };
    res.send(200, 'ok');
};