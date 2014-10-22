var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config/environment/index');
var when = require('when');
var logger = require('../utils/logger.js');

var userService = require('./user.service.js');

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
            // make only send enough to identify the user (don't want to send password, etc)
            user: {_id: user._id, email:user.email}
        };
    }
}

/**
 * Validates the username and password and calls back with the authenticated
 * user or an error if the user cannot be authenticated.  Expects password
 * in plain text.
 *
 * @param username username/email
 * @param password non hashed password
 *
 * @returns {*}
 */
function findAuthedUser(username, password) {
    if (!username || !password) {
        // missing username or password
        return when.reject('Missing username or password');
    }

    // Fetch the appropriate user, if they exist

    var defer = when.defer();

    userService.findUserByEmail(username)
        .then(function(user){
            if (!user) {
                // user not found
               return defer.reject('Authentication failed');
            }

            var isMatch = user.authenticate(password);
            if (isMatch) {
                // SUCCESS!!
                defer.resolve(user);
            } else {
                // invalid password
                defer.reject('Authentication failed');
            }

        }, function(err){
            defer.reject('Authentication failed');
            logger.courier(err);
        });

    return defer.promise;
}

exports.findAuthedUser = findAuthedUser;
exports.createToken = createToken;