'use strict';

var when = require('when');

var User = require('./../models/user.model.js');
var config = require('../config/environment');

var userDao = require('../dao/user.dao.js');

function findUsers() {
    return when(userDao.findUsersPromise());
}

/**
 * WARNING: returns password info!
 *
 * @param id
 * @returns {*}
 */
function findUserByIdWithPassword(id) {
    return when(userDao.findUserByIdPromise(id));
}

function findUserByIdWithoutPassword(id) {
    return when(userDao.findUserByIdWithoutPasswordPromise(id));
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

function createUsers(users) {
    return when(userDao.createUsersPromise(users));
}

/**
 * Deletes a user
 */
function deleteUserById(id) {
    return when(userDao.deleteUserByIdPromise(id));
};

function deleteAllUsers() {
    return when(userDao.deleteAllUsers());
}

//[Lindsay Thurmond:10/10/14] TODO: is there a cleaner way to do this?
function changePassword(userId, oldPass, newPass) {
    var defer = when.defer();
    findUserByIdWithPassword(userId)
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
exports.findUserByIdWithPassword = findUserByIdWithPassword;
exports.findUserByIdWithoutPassword = findUserByIdWithoutPassword;
exports.createUser = createUser;
exports.createUsers = createUsers;
exports.deleteUserById = deleteUserById;
exports.deleteAllUsers = deleteAllUsers;
exports.changePassword = changePassword;
