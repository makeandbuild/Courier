'use strict';

var Beacon = require('./../models/beacon.model.js');
var mongoose = require('mongoose');

exports.createBeaconsPromise = function(beacons) {
    var promise = new mongoose.Promise;
    Beacon.create(beacons, function() {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if(err) {
            return promise.reject(err);
        }

        var savedBeacons = [];
        for (var i = 1; i < arguments.length; i++) {
            var savedBeacon = arguments[i];
            savedBeacons.push(savedBeacon);
        }
        promise.complete(savedBeacons);
    });
    return promise;
}
