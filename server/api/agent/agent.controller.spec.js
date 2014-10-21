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

describe('Test /api/agents API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var agent = {
        id: 'idtester',
        name: 'Agent Tester',
        location: 'test location',
        capabilities: ['audio', 'visual'],
        approvedStatus: 'Pending',
        operationalStatus: 'Success'
    };

    // CREATE AGENT

    it('POST /api/agents -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/agents')
            .send(agent)
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

    it('POST /api/agents -> should create a single agent', function (done) {
        request(app)
            .post('/api/agents')
            .send(agent)
            .set('x-access-token', token)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                res.body.should.have.property('_id');
                agent = res.body;
                done();
            });
    });

    // GET ALL AGENTS

    it('GET /api/agents -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/agents')
            .expect(401, done);
    });

    it('GET /api/agents -> should respond with JSON array of agents', function (done) {
        request(app)
            .get('/api/agents')
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });

    // GET SINGLE AGENT

    it('GET /api/agents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .get('/api/agents/' + agent._id)
            .expect(401, done);
    });

    it('GET /api/agents/:id -> should respond with a single agent', function (done) {
        request(app)
            .get('/api/agents/' + agent._id)
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

    agent.name = 'New Agent Name';

    it('PUT /api/agents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .put('/api/agents/' + agent._id)
            .send(agent)
            .expect(401, done);
    });

    it('PUT /api/agents/:id -> should update a single agent', function (done) {
        request(app)
            .put('/api/agents/' + agent._id)
            .send(agent)
            .set('x-access-token', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                res.body.name.should.equal('New Agent Name');
                done();
            });
    });

    // DELETE

    it('DELETE /api/agents/:id -> should respond with 401 unauthorized', function (done) {
        request(app)
            .delete('/api/agents/' + agent._id)
            .expect(401, done);
    });

    it('DELETE /api/agents/:id -> should delete a single agent', function(done) {
        request(app)
            .delete('/api/agents/' + agent._id)
            .set('x-access-token', token)
            .expect(204, done);
    });

});
