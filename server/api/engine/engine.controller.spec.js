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

describe('Test /api/engines API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var engine = {
        name: 'engine 56',
        macAddress: '78:78:78:78',
        location: 'entrance',
        operationalStatus : 'Success',
        capabilities: ['audio'],
        ipAddress: '127.0.0.1'
    }

    // CREATE ENGINE
    it('POST /api/engines -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/engines')
            .send(engine)
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

    it('POST /api/engines -> should create a single engine', function (done) {
        request(app)
            .post('/api/engines')
            .send(engine)
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                res.body.should.have.property('_id');
                engine = res.body;
                done();
            });
    });


});