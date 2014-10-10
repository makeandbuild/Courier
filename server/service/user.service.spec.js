'use strict';

var should = require('should');
var when = require('when');

var userService = require('./user.service.js');


describe('User service methods', function () {

    it('should change user password', function (done) {

        var newUser = {
            provider: 'local',
            name: 'Integration Test User',
            email: 'test_it@test_it.com',
            password: 'test'
        };

        userService.createUser(newUser)
            .then(function(savedUser){
                return userService.changePassword(savedUser._id, newUser.password, 'newPassword');
            })
            .then(function(user){
                user.should.have.property('password', 'newPassword');
                done();
            }, function(err){
                done(err);
            });
    });
});