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

describe('Test /api/beaconevents API', function () {

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';

    var token;

    var beaconEvent = {
        agentId: "id will be generated during test",
        detections: [
            {
                time: "1409847363.458166",
                uuid: "1000000000000000",
                major: "1",
                minor: "1",
                tx: "-65",
                rssi: "-75",
                distance: 1.6
            }
        ]
    };

    var agent = {
        name: 'Agent For Beacon Event Test',
        location: 'test location',
        capabilities: ['audio', 'visual'],
        approvedStatus: 'Pending',
        operationalStatus: 'Success'
    };

    // GET A TOKEN
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

    // CREATE AGENT TO USE IN TEST

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
                // update agent with generated id
                beaconEvent.agentId = agent._id;
                done();
            });
    });


    // TEST SEND BEACON EVENT
    
    it('POST /api/beaconevents -> should respond with 401 unauthorized', function (done) {
        request(app)
            .post('/api/beaconevents')
            .send(beaconEvent)
            .expect(401, done);
    });


    it('POST /api/beaconevents -> should update the agent with the beacon event info', function (done) {
        request(app)
            .post('/api/beaconevents')
            .send(beaconEvent)
            .set('x-access-token', token)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                // check that agent has been updated
                request(app)
                    .get('/api/agents/' + agent._id)
                    .set('x-access-token', token)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, resp) {
                        if (err) {
                            return done(err);
                        }
                        agent = resp.body;
                        //[Lindsay Thurmond:10/1/14] TODO: fix date format conversion
//                        agent.should.have.property('lastSeen', '1409847363.458166');
                        agent.should.have.property('lastSeen');
                        agent.should.have.property('lastSeenBy', '1000000000000000');

                        // cleanup
                        request(app).delete('/api/agents/' + agent._id).set('x-access-token', token).expect(200, done());
                    });
            });
    });

    //[Lindsay Thurmond:10/5/14] TODO: test that detections are saved to the database

});