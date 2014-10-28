'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var moment = require('moment');
var when = require('when');

var beaconDetectionService = require('../../service/beacon-detection.service.js');
var dateQueryParser = require('../../utils/date.query.parser.js');

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
    },
    {
        time: '2014-01-01T00:00:00.000Z',
        uuid: 'aufoiasufasiduf7',
        major: 11,
        minor: 10,
        tx: -44,
        rssi: -66,
        distance: 4.1,
        agentId: '5f7as65f7s'
    }
];


describe('Test /api/beacondetections API', function () {

    // make sure seed data is done loading
    beforeEach(function (done) {
        app.mongoReadyPromise.then(function () {
            done();
        });
    });

    beforeEach(function (done) {
//        if (sampleDetections[0]._id) {
//            done();
//        } else {
        // clear all detections from db, then populate with sample data above
        beaconDetectionService.deleteAllDetections()
            .then(function () {
                return beaconDetectionService.createDetections(sampleDetections, true);
            })
            .then(function (newDetections) {
                sampleDetections = newDetections;
                done();
            }, function (err) {
                done(err);
            });
//        }
    });

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

    it('POST /api/beacondetections -> should not create empty beacon detection', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send({})
            .set('x-access-token', token)
            .expect(204, done());// didn't error, but nothing created
    });

    it('POST /api/beacondetections -> should not create empty beacon detections', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send([
                {},
                {},
                {}
            ])
            .set('x-access-token', token)
            .expect(204, done());// didn't error, but nothing created
    });

    it('POST /api/beacondetections -> should create the non empty detections', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send([
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
                {}
            ])
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var responseBody = res.body;
                responseBody.should.be.instanceof(Object);
                responseBody.should.have.property('succeeded');
                responseBody.succeeded.should.have.lengthOf(1);
                responseBody.succeeded[0].should.have.property('_id');
                responseBody.should.have.property('failed');
                responseBody.failed.should.be.empty;
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

                var responseBody = res.body;
                responseBody.should.be.instanceof(Object);
                responseBody.should.have.property('succeeded');
                responseBody.succeeded.should.have.lengthOf(1);
                responseBody.succeeded[0].should.have.property('_id');
                responseBody.should.have.property('failed');
                responseBody.failed.should.be.empty;
                done();
            });
    });

    it('POST /api/beacondetections -> should create multiple beacon detections and update agents with last seen info', function (done) {
        request(app)
            .post('/api/beacondetections')
            .send([
                {
                    time: Date.now(),
                    uuid: 'aufoiasufasiduf7',
                    major: 1,
                    minor: 1,
                    tx: -68,
                    rssi: -75,
                    distance: 4.9,
                    agentId: '98sd7f9asd87po'
                },
                {
                    time: '2014-01-02T00:00:00.000Z',
                    uuid: 'aufoiasufasiduf7',
                    major: 11,
                    minor: 10,
                    tx: -44,
                    rssi: -66,
                    distance: 3.6,
                    agentId: '5f7as65f7s'
                }
            ])
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var responseBody = res.body;

                responseBody.should.be.instanceof(Object);
                responseBody.should.have.property('succeeded');
                responseBody.succeeded.should.have.lengthOf(2);
                responseBody.should.have.property('failed');
                responseBody.failed.should.be.empty;
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

    // GET FILTERED DETECTIONS

    it('GET /api/beacondetections?agentId=[value] -> should respond with array of detections filtered by agent Id', function (done) {
        request(app)
            .get('/api/beacondetections?agentId=' + sampleDetections[1].agentId)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(2);
                detections[0].should.have.property('agentId', sampleDetections[1].agentId);
                done();
            });
    });

    it('GET /api/beacondetections?uuid=[value] -> should respond with array of detections filtered by uuid', function (done) {
        request(app)
            .get('/api/beacondetections?uuid=' + sampleDetections[1].uuid)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(2);
                detections[0].should.have.property('uuid', sampleDetections[1].uuid);
                done();
            });
    });

    it('GET /api/beacondetections?time=[value] -> should respond with detections created today', function (done) {
        var anytimeToday =
            dateQueryParser.createRangeQuery(moment().startOf('day').toISOString(), moment().endOf('day').toISOString());

        request(app)
            .get('/api/beacondetections?time=' + anytimeToday)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(3);
                done();
            });
    });

    it('GET /api/beacondetections?time=[value] -> should respond with detections created today', function (done) {
        var anytimeToday =
            dateQueryParser.createRangeQuery(moment().startOf('day').toISOString());

        request(app)
            .get('/api/beacondetections?time=' + anytimeToday)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(3);
                done();
            });
    });

    it('GET /api/beacondetections?time=[value] -> should respond with detections created prior to today', function (done) {
        var beforeToday =
            dateQueryParser.createRangeQuery(null, moment().startOf('day').subtract('days', 1).toISOString());

        request(app)
            .get('/api/beacondetections?time=' + beforeToday)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(1);
                done();
            });
    });

    it('GET /api/beacondetections?uuid=[value] -> should respond with array of detections filtered by uuid', function (done) {
        request(app)
            .get('/api/beacondetections?uuid=' + sampleDetections[1].uuid + '&agentId=' + sampleDetections[1].agentId)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                var detections = res.body;
                detections.should.be.instanceof(Array);
                detections.should.have.lengthOf(1);
                detections[0].should.have.property('uuid', sampleDetections[1].uuid);
                detections[0].should.have.property('agentId', sampleDetections[1].agentId);
                done();
            });
    });

});