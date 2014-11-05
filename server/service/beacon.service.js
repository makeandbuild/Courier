/**
 * Service layer for beacons
 */
'use strict';

var Beacon = require('./../models/beacon.model.js');
var when = require('when');
var beaconDao = require('../dao/beacon.dao.js');


exports.findBeacons = function () {
    return when(beaconDao.findBeaconsPromise());
}

exports.findBeaconById = function (id) {
    return when(beaconDao.findBeaconByIdPromise(id));
}

exports.findByUuid = function (uuid) {
    return when(beaconDao.findByUuidPromise(uuid));
}

/**
 *
 * @param uniqueKey  format = <uuid>:<major>:<minor>
 */
exports.findByUniqueKey = function findByUniqueKey(uniqueKey) {
    var parts = uniqueKey.split(':');
    var uuid = parts[0];
    var major = parts[1];
    var minor = parts[2];

    var filters = {
        uuid : uuid,
        major : major,
        minor : minor
    }

    return when(beaconDao.findFilteredBeaconsPromise(filters));
}

exports.createBeacon = function (beacon) {
    return when(beaconDao.createBeaconPromise(beacon));
};

exports.createBeacons = function (beacons) {
    return when(beaconDao.createBeaconsPromise(beacons));
}

exports.updateBeacon = function (beacon) {
    if (!beacon) {
        return when.reject('Cannot update empty beacon');
    }
    return when(beaconDao.updateBeaconPromise(beacon));
}

exports.deleteBeacon = function (id) {
    return when(beaconDao.deleteBeaconByIdPromise(id));
};