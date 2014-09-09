var APIeasy = require('api-easy'),
    assert = require('assert'),
    _ = require("underscore");

var suite = APIeasy.describe('api');

suite.discuss('Courier API Tests')
    .discuss('ping tests')
    .use('localhost', 9000)
    .post("api/ping", {
        agent: "540756a9a36b267c0a5965dd",
        apikey: "awef8a40t243af",
        beacons: [
            {
                time: "1409847363.458166",
                uuid: "1000000000000000",
                major: "1",
                minor: "1",
                tx: "-65",
                rssi: "-75"
            }
        ]
        }).expect(403);

