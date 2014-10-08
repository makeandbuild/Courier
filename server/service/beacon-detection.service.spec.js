'use strict';

var should = require('should');
var app = require('./../app');
var beaconDetectionService = require('./beacon-detection.service.js');
var when = require('when');


var sampleDetections = [
    {
        time: Date.now(),
        uuid: '787654ffrgy',
        major: 1,
        minor: 1,
        tx: -65,
        rssi: -75,
        distance: 3.7,
        agentId: '98asd7fa9s8d7fa'
    },
    {
        time: Date.now(),
        uuid: '787654ffrgy',
        major: 1,
        minor: 1,
        tx: -61,
        rssi: -72,
        distance: 3.1,
        agentId: '98sd7f9asd87po'
    },
    {
        time: Date.now(),
        uuid: 'aufoiasufasiduf7',
        major: 1,
        minor: 1,
        tx: -68,
        rssi: -75,
        distance: 2.9,
        agentId: '98sd7f9asd87po'
    }
];

function createSampleBeaconDetection() {
    var beaconDetections = when.defer();
    beaconDetectionService.createDetections(sampleDetections, true)
        .then(function(newDetections){
            beaconDetections.resolve(newDetections);

        });
    return beaconDetections.promise;
}

describe('Beacon detection service methods', function () {

    beforeEach(function (done) {
        if (sampleDetections[0]._id) {
            done();
        } else {
            // clear all detections from db, then populate with sample data above
            beaconDetectionService.deleteAllDetections()
                .then(createSampleBeaconDetection()
                    .then(function (newDetections) {
                        sampleDetections = newDetections;
                        done();
                    })
            );
        }
    });

    it('should find all detections', function (done) {
        beaconDetectionService.findDetections()
            .then(function(detections){
                detections.should.be.instanceOf(Array);
                detections.length.should.be.greaterThan(0);
                done();
            }, function(err){
                done(err);
            });
    });

    it('should find all detections for beacon with uuid = ' + sampleDetections[0].uuid, function (done) {
        beaconDetectionService.findDetectionsByUuid(sampleDetections[0].uuid)
            .then(function (detections) {
                detections.should.be.instanceOf(Array);
                detections.should.have.lengthOf(2);
                done();
            }, function (err) {
                console.log(err);
                done(err);
            });
    });

    it('should find all detections for beacon with agentId = ' + sampleDetections[0].agentId, function (done) {
        beaconDetectionService.findDetectionsByAgentId(sampleDetections[0].agentId)
            .then(function (detections) {
                detections.should.be.instanceOf(Array);
                detections.should.have.lengthOf(1);
                done();
            }, function (err) {
                console.log(err);
                done(err);
            });
    });

    //[Lindsay Thurmond:10/7/14] TODO: add date ranges to this test
    it('should find detections filtered by agentId and uuid', function (done) {
        var agentId = sampleDetections[0].agentId;
        var uuid = sampleDetections[0].uuid;

        beaconDetectionService.findFilteredDetections(uuid, agentId, null, null)
            .then(function (detections) {
                detections.should.be.instanceOf(Array);
                detections.should.have.lengthOf(1);
                done();
            }, function (err) {
                console.log(err);
                done(err);
            });
    });

});