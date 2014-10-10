'use strict';

var when = require('when');

var User = require('./../models/user.model.js');
var config = require('../config/environment');

var userDao = require('../dao/user.dao.js');

//[Lindsay Thurmond:10/1/14] TODO: pull service methods out of controller

function findUsers() {
    return when(userDao.findUsersPromise());
}

function findUserById(id) {
    return when(userDao.findUserByIdPromise(id));
}

//[Lindsay Thurmond:10/10/14] TODO: is there a better way to do this?
function createUser(user) {
    var newUser = new User(user);
    newUser.provider = 'local';
    newUser.role = 'user';
    var defer = when.defer();
    newUser.save(function(err, user){
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(user);
        }
    });
    return defer.promise;
};

/**
 * Deletes a user
 */
function deleteUser(id) {
    return when(userDao.deleteUserByIdPromise(id));
};

//[Lindsay Thurmond:10/10/14] TODO: is there a cleaner way to do this?
function changePassword(userId, oldPass, newPass) {
    var defer = when.defer();
    findUserById(userId)
        .then(function (user) {
            if (user.authenticate(oldPass)) {
                user.password = newPass;
                user.save(function (err, user) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(user);
                    }
                });
            }
        }, function (err) {
            defer.reject('403 ' + err);
        });
    return defer.promise;
}

exports.findUsers = findUsers;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.changePassword = changePassword;
