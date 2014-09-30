'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// not positive what goes in an event, but this is a start
var PingSchema = new Schema({
  time: String,
  uuid: String,
  major: Number,
  minor: Number,
  tx: Number,
  rssi: Number,
  distance: Number
});

module.exports = mongoose.model('Ping', PingSchema);
