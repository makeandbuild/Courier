'use strict';

var express = require('express');
var controller = require('./ping.controller');

var router = express.Router();

router.post('/', controller.ping_mode1);

module.exports = router;