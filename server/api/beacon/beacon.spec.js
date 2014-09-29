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

describe('GET /api/beacons', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var beacon = {
        name: 'Beacon 55',
        uuid: 9090,
        major: 89,
        minor: 90987
    };

    // CREATE BEACON

    it('POST /api/beacons -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/beacons')
            .send(beacon)
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

    it('POST /api/beacons -> should create a single beacon', function (done) {
        request(app)
            .post('/api/beacons')
            .send(beacon)
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                res.body.should.have.property('_id');
                beacon = res.body;
                done();
            });
    });

    // GET ALL BEACONS

    it('GET /api/beacons -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/beacons')
            .expect(401, done);
    });

    it('GET /api/beacons -> should respond with JSON array of beacons', function (done) {
        request(app)
            .get('/api/beacons')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });

    // GET SINGLE BEACON

    it('GET /api/beacons/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/beacons/' + beacon._id)
            .expect(401, done);
    });

    it('GET /api/beacons/:id -> should respond with a single beacon', function (done) {
        request(app)
            .get('/api/beacons/' + beacon._id)
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

    beacon.name = 'New Name';

    it('PUT /api/beacons/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .put('/api/beacons/' + beacon._id)
            .send(beacon)
            .expect(401, done);
    });

    it('PUT /api/beacons/:id -> should update a single beacon', function (done) {
        request(app)
            .put('/api/beacons/' + beacon._id)
            .send(beacon)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                res.body.name.should.equal('New Name');
                done();
            });
    });

    // DELETE

    it('DELETE /api/beacons/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .delete('/api/beacons/' + beacon._id)
            .expect(401, done);
    });

    it('DELETE /api/beacons/:id -> should delete a single beacon', function(done) {
        request(app)
            .delete('/api/beacons/' + beacon._id)
            .set('x-access-token', token)
            .expect(204, done);
    });

});
