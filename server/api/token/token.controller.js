var express = require('express');
var User = require('../user/user.model');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../../config/environment');
var tokenService = require('./token.service.js');

exports.index = function (req, res) {
    var username = req.headers.username;
    var password = req.headers.password;

    if (!username || !password) {
        // missing username or password, or expected error
        return sendNotAuthorized(res);
    }

    // Fetch the appropriate user, if they exist
    User.findOne({ email: username }, function (err, user) {

        if (err || !user) {
            // user not found
            return sendNotAuthorized(res);
        }

        var isMatch = user.authenticate(password);
        if (isMatch) {
            var token = tokenService.createToken(user);
            res.json(token);
        } else {
            // invalid password
            return sendNotAuthorized(res);
        }
    });
}

function sendNotAuthorized(res) {
    res.send('Authentication error', 401);
}
