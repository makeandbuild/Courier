'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var tokenAuth = require('../../auth/middleware/token-auth.js'); // checks token only
var roleAuth = require('../../auth/middleware/role-auth.js'); // checks token & role

var router = express.Router();

router.get('/', roleAuth('admin'), controller.index);
router.delete('/:id', roleAuth('admin'), controller.destroy);
router.get('/me', tokenAuth, controller.me);
router.put('/:id/password', tokenAuth, controller.changePassword);
router.get('/:id', tokenAuth, controller.show);
// [Lindsay Thurmond:9/29/14] TODO: can't have auth from front end because of how 'register' front end form works, but we might still want it from server side?
router.post('/', controller.create);

module.exports = router;
