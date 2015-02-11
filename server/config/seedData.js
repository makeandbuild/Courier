'use strict';

var moment = require('moment');

exports.users = [
    {
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
    },
    {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
    }
];

exports.beacons = [
    {
        name: 'Lindsay Estimote Blue',
        uuid: 'b9407f30f5f8466eaff925556b57fe6d',
        major: 19602,
        minor: 10956,
        active: true,
        audio: {
            filename: 'sogood.wav'
        }
    },
    {
        name: 'Tom Estimote Green',
        uuid: 'b9407f30f5f8466eaff925556b57fe6d',
        major: 814,
        minor: 17788,
        active: true,
        audio: {
            filename: 'streaking.wav'
        }
    },
    {
        name: 'Gimbal Lindsay',
        uuid: 'b9407f30f5f8466eaff925556b57fe6d',
        major: 99,
        minor: 73,
        active: true,
        audio: {
            filename: 'nananana.wav'
        }
    },
    {
        name : "Reese iPhone" ,
        uuid : "b9407f30f5f8466eaff925556b57fe6d" ,
        major : 50,
        minor : 54,
        active: true,
        audio: {
            filename: 'hello.mp3'
        }
    }
];

exports.agents = [
    {
        customId: '00:0a:95:9d:68:16',
        name: 'Agent 1',
        location: 'entry way',
        capabilities: ['audio'],
        approvedStatus: 'Pending',
        operationalStatus: 'Failure',
        lastSeenBy: exports.beacons[0].uuid,
        lastSeen: Date.now(),
        registered: moment().day(-1),
        audio: {
            filename: 'sogood.wav'
        }
    },
    {
        customId: '00:1C:B3:09:85:15',
        name: 'Agent 2',
        location: 'great room',
        capabilities: ['audio'],
        approvedStatus: 'Approved',
        operationalStatus: 'Failure',
        registered: moment().day(-2),
        audio: {
            filename: 'sogood.wav'
        }
    },
    {
        customId: '00:A0:C9:14:C8:29',
        name: 'Agent 3',
        location: 'situation room',
        capabilities: ['audio'],
        approvedStatus: 'Denied',
        operationalStatus: 'Failure',
        registered: moment().day(-7),
        audio: {
            filename: 'sogood.wav'
        }
    }
];