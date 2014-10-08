'use strict';

var Beacon = require('./../models/beacon.model.js');
var mongoose = require('mongoose');
var _ = require('lodash');


exports.findBeaconsPromise = function () {
    return Beacon.find().exec();
}


exports.findBeaconByIdPromise = function (id) {
    return Beacon.findById(id).exec();
}

exports.createBeaconPromise = function (beacon) {
    return Beacon.create(beacon); // returns a promise without needing .exec()
};


exports.createBeaconsPromise = function (beacons) {
    var promise = new mongoose.Promise;
    Beacon.create(beacons, function () {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if (err) {
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

//[Lindsay Thurmond:10/8/14] TODO:  there has to be a better way to do this
exports.updateBeaconPromise = function (beacon) {
    var promise = new mongoose.Promise;

    var beaconId;
    if (beacon._id) {
        beaconId = beacon._id;
        delete beacon._id;
    }
    Beacon.findById(beaconId, function (err, beaconToUpdate) {
        if (err) {
            return promise.reject(err);
        }
        if (!beaconToUpdate) {
            return promise.reject('No beacon with id=' + beaconId + ' found to update.');
        }
        var updated = _.merge(beaconToUpdate, beacon);
        updated.save(function (err) {
            if (err) {
                return promise.reject(err);
            }
            return promise.complete(beaconToUpdate);
        });
    });
    return promise;
}

exports.deleteBeaconByIdPromise = function (id) {
    return Beacon.findById(id).remove().exec();
}
