/**
 * Service layer for beacons
 */
'use strict';

var Beacon = require('./../models/beacon.model.js');
var mongoose = require('mongoose');
var beaconDao = require('../dao/beacon.dao.js');


exports.findBeacons = function (optionalCallback) {
    var promise = beaconDao.findBeaconsPromise();
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
}

exports.findBeaconById = function (id, optionalCallback) {
    var promise = beaconDao.findBeaconByIdPromise(id);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
}

exports.createBeacon = function (beacon, optionalCallback) {
    var promise = beaconDao.createBeaconPromise(beacon);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
};

exports.createBeaconsPromise = function(beacons, optionalCallback) {
    var promise = beaconDao.createBeaconsPromise(beacons);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
}

exports.updateBeacon = function (beacon, optionalCallback) {
    //[Lindsay Thurmond:10/8/14] TODO: make util method for instant fail case
    if (!beacon) {
        var promise = new mongoose.Promise;
        if(optionalCallback) {
            optionalCallback.addBack(optionalCallback);
        }
        promise.reject('Cannot update empty beacon');
        return promise;
    }

    promise = beaconDao.updateBeaconPromise(beacon);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
}

exports.deleteBeacon = function (id, optionalCallback) {
    var promise = beaconDao.deleteBeaconByIdPromise(id);
    if (optionalCallback) {
        promise.addBack(optionalCallback);
    }
    return promise;
};