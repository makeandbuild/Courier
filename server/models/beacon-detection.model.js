'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeaconDetectionSchema = new Schema({
        agentId: String,
        time: Date,
        uuid: String,
        major: Number,
        minor: Number,
        tx: Number,
        rssi: Number,
        proximity: Number
    },
    {
        capped: { size: 107374182, max: 100 }
    }
);

module.exports = mongoose.model('BeaconDetection', BeaconDetectionSchema);
