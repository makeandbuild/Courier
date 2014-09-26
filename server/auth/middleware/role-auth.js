'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var compose = require('composable-middleware');
var User = require('../../api/user/user.model');
var tokenAuth = require('./token-auth.js');


/**
 * Authentication Middleware
 *
 * Checks if the user has a token and if so checks that they have the required role for the route
 */
module.exports = function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(tokenAuth)
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                res.send(403);
            }
        });
}