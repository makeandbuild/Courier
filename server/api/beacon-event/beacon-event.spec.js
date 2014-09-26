'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('beaconEvent API Testing', function() {

    var createdBeacon;

    it('should create beacon event object', function(done) {
        request(app)
            .post('/api/beaconEvents')
            .send({
                time: Date.now(),
                uuid: '0000000',
                major: 11111,
                minor: 22222,
                tx: 3,
                rssi: 1,
                distance: 1.2
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                createdBeacon = res.body;
                done();
            });
    });

    it('should get a single beacon event', function(done){
        request(app)
            .get('/api/beaconEvents/' + createdBeacon._id)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                done();
            });
    });

    it('should get a list of beacon events', function(done) {
        request(app)
            .get('/api/beaconEvents')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
//[Lindsay Thurmond:9/23/14] TODO: figure out how to get PUT test to work
//    it('should update a beacon event', function(done) {
//        createdBeacon.distance = 3.2;
//
//        request(app)
//            .put('/api/beaconEvents/' + createdBeacon._id)
//            .expect(200)
//            .expect('Content-Type', /json/)
//            .end(function(err, res) {
//                if (err) return done(err);
//                res.body.should.be.instanceof(Object);
//                expect(res.body.distance).toEqual(3.2);
//                done();
//            });
//    });

    it('should delete a beacon event', function(done) {
        request(app)
            .delete('/api/beaconEvents/' + createdBeacon._id)
            .expect(204, done);
    });

});