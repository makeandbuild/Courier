'use strict';

var should = require('should');

var seedData = require('../config/seedData.js');
var userService = require('./user.service.js');
var tokenService = require('./token.service.js');

describe('Token service methods', function () {

    var databaseUsers;

    beforeEach(function (done) {
        // only need to actually do this once
        if (databaseUsers) {
            return done();
        }
            // clear and repopulate database users
            userService.deleteAllUsers()
                .then(function () {
                    return userService.createUsers(seedData.users);
                })
                .then(function (users) {
                    databaseUsers = users;
                    done();
                }, function (err) {
                    done(err);
                });
    });

    it('should create token for user that expires in the future', function (done) {
        var token = tokenService.createToken(databaseUsers[0]);
        token.token.should.not.be.empty;
        (token.user === null).should.be.false;
        token.expires.should.be.greaterThan(Date.now());
        done();
    });

    it('should authenticate a valid user', function (done) {
        tokenService.findAuthedUser('test@test.com', 'test')
            .then(function (user) {
                if (!user) {
                    return done('no user found');
                }
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should fail to authenticate an invalid user', function (done) {
        tokenService.findAuthedUser('test@test.com', 'incorrect password')
            .then(function (user) {
                if (!user) {
                    // user not found, this works too!
                    return done();
                }
                done('auth should have failed for invalid user');
            }, function (err) {
                // got expected error, hooray!
                done();
            });
    });

});