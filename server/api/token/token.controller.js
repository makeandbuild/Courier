var tokenService = require('./../../service/token.service.js');

/**
 * Get a token for the user with credentials
 * GET /api/tokens
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var username = req.headers.username;
    var password = req.headers.password;

    tokenService.findAuthedUser(username, password)
        .then(function (authenticatedUser) {
            if (authenticatedUser) {
                // create token and send back
                var token = tokenService.createToken(authenticatedUser);
                res.json(token);
            } else {
                return res.send(err, 401);
            }
        }, function (err) {
            return res.send(err, 401);
        });
}
