'use strict';

var User = require('./../../models/user.model.js');
var config = require('../../config/environment');
var tokenService = require('../../service/token.service.js');
var userService = require('../../service/user.service.js');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 *
 * GET /api/users
 */
exports.index = function(req, res) {
    userService.findUsers()
        .then(function(users){
            res.json(200, users);
        }, function(err){
            return res.send(500, err);
        });
};

/**
 * Creates a new user
 * POST /api/users
 */
exports.create = function (req, res) {
    var newUser = req.body;
    userService.createUser(newUser)
        .then(function (user) {
            var token = tokenService.createToken(user);
            res.json({ token: token });
        }, function (err) {
            return validationError(res, err);
        });
};

/**
 * Get a single user
 *
 * GET /api/users/:id
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    userService.findUserById(userId)
        .then(function (user) {
            if (!user) return res.send(401);
            res.json(user.profile);
        }, function (err) {
            //[Lindsay Thurmond:10/9/14] TODO: why next() here? this isn't middleware
            return next(err);
        });
};

//[Lindsay Thurmond:10/9/14] TODO: finish refactoring from here down to separate service/dao layers and use promises

/**
 * Deletes a user
 * restriction: 'admin'
 *
 * DELETE /api/users/:id
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 *
 * PUT /api/users/:id/password
 */
exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 *
 * GET /api/users/me
 */
exports.me = function(req, res, next) {
    var user = req.user;
    if (!user) {
        return res.send(401);
    }

    var userId = user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};
