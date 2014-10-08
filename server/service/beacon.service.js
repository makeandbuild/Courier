/**
 * Service layer for beacons
 */
'use strict';

var _ = require('lodash');
var Beacon = require('./../models/beacon.model.js');
var mongoose = require('mongoose');
var beaconDao = require('../dao/beacon.dao.js');


exports.findBeacons = function (callback) {
    Beacon.find(callback);
}


exports.findBeaconById = function (id, callback) {
    Beacon.findById(id, callback);
}

exports.createBeacon = function (beacon, callback) {
    Beacon.create(beacon, callback);
};

exports.createBeaconsPromise = function(beacons, optionalCallback) {
    var promise = beaconDao.createBeaconsPromise(beacons);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
}

exports.updateBeacon = function (beacon, callback) {
    if (!beacon) {
        callback('Cannot update empty beacon');
    }
    var beaconId;
    if (beacon._id) {
        beaconId = beacon._id;
        delete beacon._id;
    }
    Beacon.findById(beaconId, function (err, beaconToUpdate) {
        if (err) {
            return callback(err);
        }
        if (!beaconToUpdate) {
            return callback(err);
        }
        var updated = _.merge(beaconToUpdate, beacon);
        updated.save(function (err) {
            if (err) {
                return callback(err);
            }
            return callback(null, beaconToUpdate);
        });
    });
}

// Deletes an beacon from the DB
exports.deleteBeacon = function (id, callback) {
    Beacon.findById(id, function (err, beaconToDelete) {
        if (err) {
            return callback(err);
        }
        if (!beaconToDelete) {
            callback(err);
        }
        beaconToDelete.remove(function (err) {
            if (err) {
                callback(err);
            }
            return callback();
        });
    });
};