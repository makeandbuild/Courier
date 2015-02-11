'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AgentSchema = new Schema({
    customId: String, // unique id for the agent - such as mac address
    name: String,
    registered: Date,
    location: String,
    lastSeen: Date,
    lastSeenBy: String, // beacon id
    capabilities: [String],
    approvedStatus: String, // Pending, Approved, Denied
    operationalStatus: String, // Success, Warning, Failure
    /**
     * Max distance a beacon can hit before being considered out of range.
     * If not set all detections will be considered in range.
     */
    range: Number,
    audio: {
        filename: { type: String }
    },
    ipAddress: String
});

module.exports = mongoose.model('Agent', AgentSchema);
