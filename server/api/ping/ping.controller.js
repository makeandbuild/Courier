/**
 * POST    /ping              ->  ping
 */

'use strict';

var _ = require('lodash');
//var Beacon = require('./beacon.model');

// Creates a new beacon in the DB.
exports.ping_mode1 = function(req, res) {
	console.log(req.body);
	res.send(200, 'ok');
};