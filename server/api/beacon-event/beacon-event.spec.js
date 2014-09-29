'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

// make sure seed data is done loading
beforeEach(function (done) {
    app.mongoReadyPromise.then(function () {
        done()
    });
});

describe('Test /api/beaconEvents API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var beaconEvent = {
        time: Date.now(),
        uuid: '0000000',
        major: 11111,
        minor: 22222,
        tx: 3,
        rssi: 1,
        distance: 1.2
    };

    // CREATE BEACON EVENT

    it('POST /api/beaconEvents -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/beaconEvents')
            .send(beaconEvent)
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

    it('POST /api/beaconEvents -> should create a single beaconEvent', function (done) {
        request(app)
            .post('/api/beaconEvents')
            .send(beaconEvent)
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                res.body.should.have.property('_id');
                beaconEvent = res.body;
                done();
            });
    });

    // GET ALL BEACON EVENTS

    it('GET /api/beaconEvents -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/beaconEvents')
            .expect(401, done);
    });

    it('GET /api/beaconEvents -> should respond with JSON array of beaconEvents', function (done) {
        request(app)
            .get('/api/beaconEvents')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });

    // GET SINGLE BEACON EVENT

    it('GET /api/beaconEvents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/beaconEvents/' + beaconEvent._id)
            .expect(401, done);
    });

    it('GET /api/beaconEvents/:id -> should respond with a single beaconEvent', function (done) {
        request(app)
            .get('/api/beaconEvents/' + beaconEvent._id)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                done();
            });
    });

    // UPDATE

    beaconEvent.distance = 3.2;

    it('PUT /api/beaconEvents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .put('/api/beaconEvents/' + beaconEvent._id)
            .send(beaconEvent)
            .expect(401, done);
    });

    it('PUT /api/beaconEvents/:id -> should update a single beaconEvent', function (done) {
        request(app)
            .put('/api/beaconEvents/' + beaconEvent._id)
            .send(beaconEvent)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                res.body.distance.should.equal(3.2);
                done();
            });
    });

    // DELETE

    it('DELETE /api/beaconEvents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .delete('/api/beaconEvents/' + beaconEvent._id)
            .expect(401, done);
    });

    it('DELETE /api/beaconEvents/:id -> should delete a single beaconEvent', function(done) {
        request(app)
            .delete('/api/beaconEvents/' + beaconEvent._id)
            .set('x-access-token', token)
            .expect(204, done);
    });

});
