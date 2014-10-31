'use strict';

var express = require('express');
var controller = require('./beacon.controller');
var tokenAuth = require('../../auth/middleware/token-auth.js'); // checks token only

var options = require('../../auth/middleware/options.js');
var cors = require('../../auth/middleware/cors.js');

var router = express.Router();

router.use(cors);

// route middleware that will happen on every request
router.use(tokenAuth);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.options('/', options);


module.exports = router;
