'use strict';

var when = require('when');

var User = require('./../models/user.model.js');
var config = require('../config/environment');

var userDao = require('../dao/user.dao.js');

//[Lindsay Thurmond:10/1/14] TODO: pull service methods out of controller

exports.findUsers = function findUsers() {
    return when(userDao.findUsersPromise());
}

exports.findUserById = function (id) {
    return when(userDao.findUserByIdPromise(id));
}

exports.createUser = function (user) {
    var newUser = new User(user);
    newUser.provider = 'local';
    newUser.role = 'user';
    return when(newUser.save().exec());
};