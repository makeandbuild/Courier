'use strict';

var rules = []

exports.registerRule  = function (ruleFunction) {
    rules.push(ruleFunction);
}

/**
 * @param detectionEvent Format:
 *   {
 *     agentId: "",
 *     beaconUuid: "",
 *     beaconMajor: 5,
 *     beaconMinor: 4,
 *     proximity: 1.2,
 *     eventType: "enter"
 *   }
 */
exports.processDetectionEvent = function (detectionEvent) {

    rules.forEach(function(rule){
        rule(detectionEvent);
    });

}
