'use strict';

module.exports = function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,x-access-token,username,password,Accept");
    next();
}

//    app.use(function(req, res, next) {
//        res.header("Access-Control-Allow-Origin", "*");
//        res.header("Access-Control-Allow-Headers", "X-Requested-With");
//        next();
//    });

// Add headers
//    app.use(function (req, res, next) {
//
//        // Website you wish to allow to connect
////        res.setHeader('Access-Control-Allow-Origin', 'http://arrontedesign.com');
//        res.setHeader('Access-Control-Allow-Origin', '*');
//
//        // Request methods you wish to allow
//        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//        // Request headers you wish to allow
//        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-access-token,username,password,Accept');
//
//        // Set to true if you need the website to include cookies in the requests sent
//        // to the API (e.g. in case you use sessions)
////        res.setHeader('Access-Control-Allow-Credentials', true);
//
//        // Pass to next layer of middleware
//        next();
//    });

//    app.all('*', function(req, res, next) {
//        res.header("Access-Control-Allow-Origin", "*");
//        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//        next();
//    });