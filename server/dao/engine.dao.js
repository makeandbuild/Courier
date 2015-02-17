'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var Engine = require('./../models/engine.model.js');

var _this = this;

exports.findEnginesPromise = function() {
    return Engine.find().exec();
}

exports.findEngineByUnderscoreId = function (_id) {
    return Engine.findById(_id).exec();
}

exports.findEngineByMacAddressPromise = function(macAddress) {
    return Engine.findOne({macAddress:macAddress}).exec();
}

exports.createEnginePromise = function (engine) {
    return Engine.create(engine); // returns a promise without needing .exec()
}

exports.updateEnginePromise = function(engine) {
    var promise = new mongoose.Promise;
    _this.findEngineByUnderscoreId(engine._id)
        .then(function(engineToUpdate){
            if (!engineToUpdate) {
                return promise.reject('No engine with _id = ' + engine._id + ' found to update');
            }
            delete engine._id;
            var updated = _.merge(engineToUpdate, engine);
            updated.save(function(err){
                if (err) {
                    return promise.reject(err);
                }
                return promise.complete(engineToUpdate);
            });
        },
        function(err){
            promise.reject(err);
        });
    return promise;
}

exports.deleteEngineByIdPromise = function (_id) {
    return Engine.findById(_id).remove().exec();
}