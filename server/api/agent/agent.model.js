'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
  name: String,
  location: String,
  lastSeen: Date,
  capabilities: [String]
});

module.exports = mongoose.model('Agent', AgentSchema);
