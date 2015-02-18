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

exports.findByUuidPromise = function(uuid){
    return Beacon.findOne({uuid:uuid}).exec();
}

exports.createBeaconPromise = function (beacon) {
    return Beacon.create(beacon); // returns a promise without needing .exec()
};

exports.findFilteredBeaconsPromise = function (filters) {
    return Beacon.find(filters).exec();
}

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

exports.updateBeaconPromise = function (beacon) {
    var promise = new mongoose.Promise;

    var beaconId;
    if (beacon._id) {
        beaconId = beacon._id;
        delete beacon._id;
    }
    Beacon.findById(beaconId).exec()
        .then(function(beaconToUpdate) {
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
        }, function(err){
            return promise.reject(err);
        });

    return promise;
}

exports.deleteBeaconByIdPromise = function (id) {
    return Beacon.findById(id).remove().exec();
}

exports.deleteAllBeacons = function() {
    return Beacon.find({}).remove().exec();
}
