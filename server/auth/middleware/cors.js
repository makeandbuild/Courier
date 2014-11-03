'use strict';

module.exports = function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,x-access-token,username,password,Accept");
    next();
}