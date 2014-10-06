'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

// make sure seed data is done loading
beforeEach(function (done) {
    app.mongoReadyPromise.then(function () {
        done();
    });
});

describe('Test /api/beacondetections API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var beaconDetection = {
        time: Date.now(),
        uuid: '0000000',
        major: 11111,
        minor: 22222,
        tx: 3,
        rssi: 1,
        distance: 1.2
    };

    // ACCEPT BEACON DETECTION

    it('POST /api/beacondetections -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send(beaconDetection)
            .expect(401, done);
    });

    it('GET /api/tokens -> should get a token for an authorized user', function (done) {
        request(app)
            .get('/api/tokens')
            .set('username', AUTHORIZED_USERNAME)
            .set('password', AUTHORIZED_PASSWORD)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                token = res.body.token;
                done();
            });
    });

    it('POST /api/beacondetections -> should create a single beacon detection', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send(beaconDetection)
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                res.body.should.have.property('_id');
                beaconDetection = res.body;
                done();
            });
    });

    // GET ALL DETECTIONS

    it('GET /api/beacondetections -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/beacondetections')
            .expect(401, done);
    });

    it('GET /api/beacondetections -> should respond with JSON array of beacon detections', function (done) {
        request(app)
            .get('/api/beacondetections')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.length.should.be.above(0);
                done();
            });
    });

});