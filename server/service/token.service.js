var express = require('express');
var User = require('../models/user.model.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config/environment/index');

function createToken(user) {
    if (user) {
        // found the user, give them a token
        var expires = moment().add(config.token.amount, config.token.unitOfTime).valueOf();
        var token = jwt.encode(
            {
                iss: user._id,
                exp: expires
            },
            config.secrets.jwtTokenSecret
        );
        return {
            token: token,
            expires: expires,
            user: user.toJSON()
        };
    }
}

/**
 * Validates the username and password and calls back with the authenticated
 * user or an error if the user cannot be authenticated.
 *
 * @param username
 * @param password
 * @param callback (err, user)
 * @returns {*}
 */
function findAuthedUser(username, password, callback) {
    if (!username || !password) {
        // missing username or password
        return callback('Missing username or password');
    }

    // Fetch the appropriate user, if they exist
    User.findOne({ email: username }, function (err, user) {

        if (err || !user) {
            // user not found
            return callback('Authentication failed');
        }

        var isMatch = user.authenticate(password);
        if (isMatch) {
            // SUCCESS!!
            return callback(null, user);
        } else {
            // invalid password
            return callback('Authentication failed');
        }
    });

}

exports.findAuthedUser = findAuthedUser;
exports.createToken = createToken;