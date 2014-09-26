'use strict';

var express = require('express');
var controller = require('./token.controller.js');

var router = express.Router();

//    app.get('/token', express.bodyParser(), function (req, res)

router.get('/', controller.index);

// Set the secret for encoding/decoding JWT tokens
//router.set('jwtTokenSecret', 'SUPER_DUPER_SECRET_STRING');

module.exports = router;