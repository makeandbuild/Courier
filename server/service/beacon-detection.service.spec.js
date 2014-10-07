'use strict';

var should = require('should');
var app = require('./../app');
var beaconDetectionService = require('./beacon-detection.service.js');
var when = require('when');

var sampleDetection = {
    time: Date.now(),
    uuid: '787654ffrgy',
    major: 1,
    minor: 1,
    tx: -65,
    rssi: -75,
    distance: 3.7
};

function createSampleBeaconDetection() {
    var beaconDetection = when.defer();
    beaconDetectionService.createDetection(sampleDetection, function (err, newDetection) {
        beaconDetection.resolve(newDetection);
    }, true);
    return beaconDetection.promise;
}

describe('Beacon detection service methods', function () {

    beforeEach(function (done) {
        if (sampleDetection._id) {
            done();
        } else {
            createSampleBeaconDetection()
                .then(function (newDetection) {
                    sampleDetection = newDetection;
                    done();
                });
        }
    });

    // assumptions based off seed.js data

    it('should find all detections', function (done) {
        beaconDetectionService.findDetections(function (err, detections) {
            if (err) {
                done(err);
            }
            detections.should.be.instanceOf(Array);
            detections.length.should.be.greaterThan(0);
            done();
        });
    });

    it('should find all detections for beacon with uuid = ' + sampleDetection.uuid, function (done) {
        beaconDetectionService.findDetectionsByBeaconUuid(sampleDetection.uuid, function (err, detections) {
            if (err) {
                console.log(err);
                done(err);
            }
            detections.should.be.instanceOf(Array);
            detections.should.have.lengthOf(1);
            done();
        });
    });

});