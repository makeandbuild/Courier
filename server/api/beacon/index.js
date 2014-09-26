'use strict';

var express = require('express');
var controller = require('./beacon.controller');
var jwtauth = require('../../auth/jwtauth.js');

var router = express.Router();

/**
 * A simple middleware to restrict access to authenticated users.
 */
var requireAuth = function(req, res, next) {
    if (!req.user) {
        res.send('Not authorized', 401);
    }	else {
        next();
    }
}

// route middleware that will happen on every request
router.use(jwtauth);
router.use(requireAuth);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
