'use strict';

var winston = require('winston');

// courier.log
// configure default logger
winston.add(winston.transports.File, {
    filename: 'courier.log',
    level: 'debug' ,
    maxsize: 1024 * 1024 * 10, // 10MB
    handleExceptions: true
});
winston.remove(winston.transports.Console);

// detections.log
// add log that will only contain detections
var detections = new winston.Logger({
    levels: {
        info: 1
    },
    transports: [
        new (winston.transports.File)({
            filename: 'detections.log',
            level: 'info',
            maxsize: 1024 * 1024 * 10, // 10MB
            handleExceptions: false,
            json: false
        })
    ]
});


var exports = {
    courier: function (level, msg) {
        winston.log(level, msg);
    },
    detections: function (msg) {
        detections.info(msg);
    },
    log: function (level, msg) {
        winston.log(level, msg);
    }
};

module.exports = exports;