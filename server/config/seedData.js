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
        name: 'Beacon 55',
        uuid: '6fdg76hdf',
        major: 89,
        minor: 90987,
        active: true
    },
    {
        name: 'Beacon 900',
        uuid: 'fgh8dfhdf09',
        major: 466,
        minor: 77,
        active: true
    },
    {
        name: 'Beacon 8798797',
        uuid: 'sd098fdg0sd98f',
        major: 6554,
        minor: 232,
        active: true
    }
];

exports.agents = [
    {
        id: '00:0a:95:9d:68:16',
        name: 'Agent 1',
        location: 'entry way',
        capabilities: ['audio'],
        approvedStatus: 'Pending',
        operationalStatus: 'Success',
        lastSeenBy: exports.beacons[0].uuid,
        lastSeen: Date.now(),
        registered: moment().day(-1)
    },
    {
        id: '00:1C:B3:09:85:15',
        name: 'Agent 2',
        location: 'great room',
        capabilities: ['audio'],
        approvedStatus: 'Approved',
        operationalStatus: 'Success',
        registered: moment().day(-2)
    },
    {
        id: '00:A0:C9:14:C8:29',
        name: 'Agent 3',
        location: 'situation room',
        capabilities: ['audio'],
        approvedStatus: 'Denied',
        operationalStatus: 'Failure',
        registered: moment().day(-7)
    }
];