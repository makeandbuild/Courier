'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeaconSchema = new Schema({
    name: String,
    uuid: String,
    major: Number,
    minor: Number,
    properties: Schema.Types.Mixed,
    active: Boolean,
    audio: {
        filename: { type: String }
    }
});

module.exports = mongoose.model('Beacon', BeaconSchema);
