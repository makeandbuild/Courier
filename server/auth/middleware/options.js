'use strict';

module.exports = function (req, res, next) {
    res.status(200).end();
    next();
};