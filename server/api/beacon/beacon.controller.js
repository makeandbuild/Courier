'use strict';

var beaconService = require('../../service/beacon.service.js');

/**
 * Get list of beacons
 * GET /beacons
 *
 * THESE FILTERS CURRENTLY HAVE HARDCODED DUMMY DATA!!!!!
 * //[Lindsay Thurmond:10/30/14] TODO: implement real data
 * Filter options = detectedBy=[agent custom id], distance=[meters]
 * Examples
 *      /beacons?detectedBy=Kitchen
 *      /beacons?detectedBy=Kitchen&distance=5 - nice to have, does nothing currently
 *
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {

    //[Lindsay Thurmond:10/30/14] TODO: replace filter section with real logic
    var detectedBy = req.query.detectedBy;
    var distance = req.query.distance;


    // hardcoded filter logic
    if (detectedBy) {
        var kitchenBeacons = [
            {
                name: 'Gabe',
                uuid: '6fdg76hdf',
                major: 89,
                minor: 90987,
                active: true
            },
            {
                name: 'Adam',
                uuid: 'fgh8dfhdf09',
                major: 466,
                minor: 77,
                active: true
            },
            {
                name: 'Tom',
                uuid: 'sd098fdg0sd98f',
                major: 657754,
                minor: 23277,
                active: true
            }
        ];
        var greatRoomBeacons = [
            {
                name: 'AZ',
                uuid: '87asdf798as',
                major: 8669,
                minor: 90666987,
                active: true
            }
        ];
        var entranceBeacons = [
            {
                name: 'Jeff',
                uuid: 'fg87sfd7gds',
                major: 89,
                minor: 90987,
                active: true
            },
            {
                name: 'Lindsay',
                uuid: 'sf87gs9df8g',
                major: 4234,
                minor: 746647,
                active: true
            },
            {
                name: 'Ian',
                uuid: 'ad98f7as',
                major: 65654,
                minor: 236562,
                active: true
            }
        ];
        var otherBeacons = [
            {
                name: 'Ken',
                uuid: 'sdfgsdf987',
                major: 90,
                minor: 232,
                active: true
            }
        ];

        var beaconsToSend;
        if ('Kitchen' === detectedBy) {
            beaconsToSend = kitchenBeacons;
        } else if ('Great Room' === detectedBy) {
            beaconsToSend = greatRoomBeacons;
        } else if ('Entrance' === detectedBy) {
            beaconsToSend = entranceBeacons;
        } else {
            beaconsToSend = otherBeacons;
        }

        return res.json(200, beaconsToSend);
    }
    // normal code for full list
    else {
        beaconService.findBeacons()
            .then(function (beacons) {
                return res.json(200, beacons);
            }, function (err) {
                return handleError(res, err);
            });
    }

};

/**
 * Get a single beacon
 * GET /beacons/:id
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
//    beaconService.findBeaconById(req.params.id)
//        .then(function (beacon) {
//            if (!beacon) {
//                return res.send(404);
//            }
//            return res.json(beacon);
//        }, function (err) {
//            return handleError(res, err);
//        });

    beaconService.findByUuid(req.params.id)
        .then(function (beacon) {
            if (!beacon) {
                return res.send(404);
            }
            return res.json(beacon);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Creates a new beacon in the DB.
 * POST /beacons
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    beaconService.createBeacon(req.body)
        .then(function (beacon) {
            return res.json(201, beacon);
        }, function (err) {
            return handleError(res, err);
        });
};

/**
 * Updates an existing beacon in the DB.
 * PUT /beacons/:id
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var beacon = req.body;
    beaconService.updateBeacon(beacon)
        .then(function (beacon) {
            if (!beacon) {
                return res.send(404);
            }
            return res.json(200, beacon);
        }, function (err) {
            return handleError(res, err);
        });
};


/**
 * Deletes a beacon from the DB.
 * DELETE /beacons/:id
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
    var beaconId = req.params.id;
    beaconService.deleteBeacon(beaconId)
        .then(function () {
            return res.send(204);
        }, function (err) {
            return handleError(res, err);
        });
};

function handleError(res, err) {
    return res.send(500, err);
}
