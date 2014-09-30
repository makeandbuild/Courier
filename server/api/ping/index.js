'use strict';

var express = require('express');
var controller = require('./ping.controller');
var tokenAuth = require('../../auth/middleware/token-auth.js');

var router = express.Router();

// route middleware that will happen on every request
router.use(tokenAuth);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.ping_mode1);

module.exports = router;