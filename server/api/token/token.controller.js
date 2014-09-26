var express = require('express');
var User = require('../user/user.model');
var jwt = require('jwt-simple');
var moment = require('moment');
var tokenConfig = require('../../config/config.token.json');

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
            // found the user, give them a token
            var expires = moment().add(tokenConfig.validFor.amount, tokenConfig.validFor.unitOfTime).valueOf();
            var token = jwt.encode(
                {
                    iss: user._id,
                    exp: expires
                },
                req.app.get('jwtTokenSecret')
            );
            res.json({
                token: token,
                expires: expires,
                user: user.toJSON()
            });
        } else {
            // invalid password
            return sendNotAuthorized(res);
        }
    });
}

function sendNotAuthorized(res) {
    res.send('Authentication error', 401);
}
