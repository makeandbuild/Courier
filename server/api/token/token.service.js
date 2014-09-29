var express = require('express');
var User = require('../user/user.model');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../../config/environment');

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

exports.createToken = createToken;