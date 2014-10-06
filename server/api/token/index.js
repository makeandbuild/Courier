'use strict';

var express = require('express');
var controller = require('./token.controller.js');

var router = express.Router();

router.get('/', controller.index); // no auth, this is how a user requests a login token


module.exports = router;