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

describe('Test /api/pings API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var ping = {
        time: Date.now(),
        uuid: '0000000',
        major: 11111,
        minor: 22222,
        tx: 3,
        rssi: 1,
        distance: 1.2
    };

    // CREATE PING

    it('POST /api/pings -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/pings')
            .send(ping)
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

    //[Lindsay Thurmond:9/30/14] TODO: fix me
//    it('POST /api/pings -> should create a single ping', function (done) {
//        request(app)
//            .post('/api/pings')
//            .send(ping)
//            .set('x-access-token', token)
//            .expect(201)
//            .expect('Content-Type', /json/)
//            .end(function (err, res) {
//                if (err) {
//                    return done(err);
//                }
//                res.body.should.be.instanceof(Object);
//                res.body.should.have.property('_id');
//                ping = res.body;
//                done();
//            });
//    });

    // GET ALL PINGS

    it('GET /api/pings -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/pings')
            .expect(401, done);
    });

    it('GET /api/pings -> should respond with JSON array of pings', function (done) {
        request(app)
            .get('/api/pings')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });

    // GET SINGLE PING

    it('GET /api/pings/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/pings/' + ping._id)
            .expect(401, done);
    });

    //[Lindsay Thurmond:9/30/14] TODO: fix me
//    it('GET /api/pings/:id -> should respond with a single ping', function (done) {
//        request(app)
//            .get('/api/pings/' + ping._id)
//            .set('x-access-token', token)
//            .expect(200)
//            .expect('Content-Type', /json/)
//            .end(function (err, res) {
//                if (err) return done(err);
//                res.body.should.be.instanceof(Object);
//                done();
//            });
//    });

});