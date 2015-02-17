'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EngineSchema = new Schema({
    name : String,
    macAddress : String,
    location : String,
    ipAddress : String,
    capabilities : [String],
    operationalStatus: { type: String, enum: ['Success', 'Warning', 'Failure'] }
});

module.exports = mongoose.model('Engine', EngineSchema);