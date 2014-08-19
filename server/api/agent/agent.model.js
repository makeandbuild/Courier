'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Agent', AgentSchema);
