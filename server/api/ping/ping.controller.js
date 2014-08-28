/**
 * POST    /ping              ->  ping
 */

'use strict';

var _ = require('lodash');
//var Beacon = require('./beacon.model');

// Creates a new beacon in the DB.
exports.ping_mode1 = function(req, res) {
	var ping = {
		'time': req.body.time,
		'uuid': req.body.uuid,
		'major': req.body.major,
		'minor': req.body.minor,
		'tx': req.body.tx,
		'rssi': req.body.rssi
	};
	console.log(ping);
	res.send(200, 'ok');
};