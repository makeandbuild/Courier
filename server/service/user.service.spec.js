'use strict';

var should = require('should');
var when = require('when');

var seedData = require('../config/seedData.js');
var userService = require('./user.service.js');


describe('User service methods', function () {

    var databaseUsers;

    beforeEach(function (done) {
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

    it('should find list of users', function (done) {

        userService.findUsers()
            .then(function (users) {
                users.should.be.instanceof(Array);
                users.should.have.length(2);
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should find a user by id with password info', function (done) {
        var lookUpId = databaseUsers[0]._id;
        userService.findUserByIdWithPassword(lookUpId)
            .then(function (user) {
                user.should.have.property('_id', lookUpId);
                user.hashedPassword.should.not.be.empty;
                user.salt.should.not.be.empty;
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should find a user by id without any password info', function (done) {
        var lookUpId = databaseUsers[0]._id;
        userService.findUserByIdWithoutPassword(lookUpId)
            .then(function (user) {
                user.should.have.property('_id', lookUpId);
                (!user.hashedPassword).should.be.true;
                (!user.salt).should.be.true;
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should create user', function (done) {

        var newUser = {
            provider: 'local',
            name: 'Create User Test',
            email: 'create@user.com',
            password: 'test'
        };

        userService.createUser(newUser)
            .then(function (user) {
                user.should.have.property('_id');
                user.should.have.property('password');
                user.should.have.property('name');
                user.should.have.property('email');
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should create multiple users', function (done) {

        var newUsers = [
            {
                provider: 'local',
                name: 'Create User Test',
                email: 'create@user.com',
                password: 'test'
            },
            {
                provider: 'local',
                name: 'Create User Test 2',
                email: 'create2@user.com',
                password: 'test'
            }
        ];

        userService.createUsers(newUsers)
            .then(function (createdUsers) {
                createdUsers.should.be.instanceof(Array);
                createdUsers.should.have.length(2);
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should change user password', function (done) {

        var newUser = {
            provider: 'local',
            name: 'Integration Test User',
            email: 'test_it@test_it.com',
            password: 'test'
        };

        userService.createUser(newUser)
            .then(function (savedUser) {
                return userService.changePassword(savedUser._id, newUser.password, 'newPassword');
            })
            .then(function (user) {
                user.should.have.property('password', 'newPassword');
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should delete a user by id', function (done) {

        var idToDelete = databaseUsers[0]._id;
        var startNumUsers = databaseUsers.length;
        userService.deleteUserById(idToDelete)
            .then(function(){
                return userService.findUsers();
            })
            .then(function (remainingUsers) {
                remainingUsers.should.have.length(startNumUsers - 1);
                done();
            }, function (err) {
                done(err);
            });
    });

    it('should delete all users', function (done) {

        userService.deleteAllUsers()
            .then(function(){
                return userService.findUsers();
            })
            .then(function (remainingUsers) {
                remainingUsers.should.be.empty;
                done();
            }, function (err) {
                done(err);
            })
    });
});