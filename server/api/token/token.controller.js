var express = require('express');
var User = require('../../models/user.model.js');
var config = require('../../config/environment');
var tokenService = require('./../../service/token.service.js');

// Get a token for the user with credentials
// GET /api/tokens
exports.index = function (req, res) {
    var username = req.headers.username;
    var password = req.headers.password;

    tokenService.findAuthedUser(username, password, function (err, authenticatedUser) {
        if (authenticatedUser) {
            // create token and send back
            var token = tokenService.createToken(authenticatedUser);
            res.json(token);
        } else {
            return res.send(err, 401);
        }
    });
}
