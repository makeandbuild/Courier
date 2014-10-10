'use strict';

var User = require('./../models/user.model.js');
var mongoose = require('mongoose');

//[Lindsay Thurmond:10/8/14] TODO: finish pulling dao related code from user.service


exports.findUsersPromise = function () {
    return User.find({}, '-salt -hashedPassword').exec();
}

exports.findUserByIdPromise = function (id) {
    return User.findById(id).exec();
}

exports.findUserByIdWithoutPasswordPromise = function (id) {
    return User.findOne({ _id: id }, '-salt -hashedPassword').exec();
}

exports.createUsersPromise = function (users) {
    var promise = new mongoose.Promise;
    User.create(users, function () {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if (err) {
            return promise.reject(err);
        }

        var savedUsers = [];
        for (var i = 1; i < arguments.length; i++) {
            var savedUser = arguments[i];
            savedUsers.push(savedUser);
        }
        promise.complete(savedUsers);
    });
    return promise;
}

exports.deleteUserByIdPromise = function (id) {
    return User.findById(id).remove().exec();
}

exports.deleteAllUsers = function () {
    return User.find({}).remove().exec();
}