'use strict';

var express = require('express');
var controller = require('./token.controller.js');
var options = require('../../auth/middleware/options.js');
var cors = require('../../auth/middleware/cors.js');

var router = express.Router();

router.use(cors);

router.get('/', controller.index); // no auth, this is how a user requests a login token
router.options('/', options);


module.exports = router;