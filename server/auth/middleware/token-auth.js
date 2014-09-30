/**
 * token-auth.js
 *
 *
 * Authentication Middleware:
 *  Parses the JWT token attached to the request. If valid the user
 *  will be attached to the request.
 *
 *  Uses jwt-simple tokens.
 */

var url = require('url');
var User = require('../../models/user.model.js');
var jwt = require('jwt-simple');
var config = require('../../config/environment');

module.exports = function (req, res, next) {

    // Parse the URL in case we need it
    var parsed_url = url.parse(req.url, true);

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    var token = (req.body && req.body.access_token) ||
        parsed_url.query.access_token || req.headers["x-access-token"];

    if (!token) {
        // failed auth
        return res.send('Not authorized', 401);
    }

    try {
        var decoded = jwt.decode(token, config.secrets.jwtTokenSecret);

        if (decoded.exp <= Date.now()) {
            res.end('Access token has expired', 400);
        }

        User.findOne({ '_id': decoded.iss }, function (err, user) {

            if (!err) {
                // found the user, add it to the request
                req.user = user;
                // happy path!
                return next();
            }
        })

    } catch (err) {
        // failed auth
        return res.send('Not authorized', 401);
    }
}