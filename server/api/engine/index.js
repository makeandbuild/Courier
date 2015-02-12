'use strict';

var express = require('express');
var controller = require('./engine.controller');
var tokenAuth = require('../../auth/middleware/token-auth.js');

var router = express.Router();

// route middleware that will happen on every request
router.use(tokenAuth);

router.get('/', controller.index);

module.exports = router;
