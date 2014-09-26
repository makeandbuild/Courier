'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('API token auth testing', function () {

    it('should not be able to get a token without credentials', function (done) {
        request(app)
            .get('/api/tokens')
            .expect(401, done);
    });

    it('should not be able to get a token for a non user', function (done) {
        request(app)
            .get('/api/tokens')
            .set('username', 'not@a.user')
            .set('password', 'pass')
            .expect(401, done);
    });

    var AUTHORIZED_USERNAME = 'test@test.com';
    var AUTHORIZED_PASSWORD = 'test';
    var token;

    it('should get a token for an authorized user', function (done) {
        request(app)
            .get('/api/tokens')
            .set('username', AUTHORIZED_USERNAME)
            .set('password', AUTHORIZED_PASSWORD)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                token = res.body.token;
                done();
            });
    });

    it('should get a token for an authorized user', function (done) {
        request(app)
            .get('/api/tokens')
            .set('username', AUTHORIZED_USERNAME)
            .set('password', AUTHORIZED_PASSWORD)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.should.be.instanceof(Object);
                token = res.body.token;
                done();
            });
    });




});