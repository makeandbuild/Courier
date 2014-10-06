'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
    name: String,
    location: String,
    lastSeen: Date,
    lastSeenBy: String, // beacon id
    capabilities: [String],
    approvedStatus: String, // Pending, Approved, Denied
    operationalStatus: String // Success, Warning, Failure
});

module.exports = mongoose.model('Agent', AgentSchema);
