'use strict';

var express = require('express');
var controller = require('./token.controller.js');

var router = express.Router();

router.get('/', controller.index);


module.exports = router;