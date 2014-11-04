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
    /**
     * Max distance a beacon can hit before being considered out of range.
     * If not set all detections will be considered in range.
     */
    range: Number
});

module.exports = mongoose.model('Beacon', BeaconSchema);
