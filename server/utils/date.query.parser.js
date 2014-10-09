'use strict';

var moment = require('moment');
var _ = require('lodash');
var _str = require('underscore.string');

function createRangeQuery(start, end) {
    var query;
    if (start) {
        query = 'gte ' + start;
    }
//    if (start && end) {
//        query += ' and';
//    }
    if (end) {
        if (query) {
            query += ' lte ' + end;
        }
        else {
            query = 'lte ' + end;
        }
    }
    return query;
};

/**
 * Supported comparators
 *  gt = greater than
 *  gte = grater than or equal
 *  lt = less than
 *  lte = less than or equal
 *
 *   Supports ranges such as
 *      time=gte 11-12-13 lte 11-12-14
 *      time=gte 11-12-13
 *      time=gt 11-12-13
 *      time=lte 11-12-14
 *      time=lt 11-12-14
 *
 *    NOT yet supported (eventually we may want to give flexibility of and/or dates)
 *      time=gte 11-12-13 and lte 11-12-14
 *
 * @param dateQuery query as written in the url
 * @returns {{}}
 */
function convertDateQueryToJson(dateQuery) {

    var dateSearch = {};

    var words = _str.words(dateQuery);
    if (words.length > 4) {
        throw Error('Invalid date query.  Too many arguments.');
    }

    dateSearch[words[0]] = words[1];

    if (words.length > 2) {
//        if (words.length === 4) {
            dateSearch[words[2]] = words[3];
//        }
//        else if (words.length === 5) {
//            var operator = words[3].toLowerCase();
//            if (operator === 'and') {
//                dateSearch.operator = operator;
//            }
//            dateSearch[words[3]] = words[4];
//        }
    }
    return dateSearch;
}

function convertDateJsonToMongoFilter(dateQueryJson) {
    var mongoFilter = {};
    if (dateQueryJson.lte) {
        mongoFilter.$lte = dateQueryJson.lte;
//        mongoFilter.$lte = convertUtcStringToJsDate(dateQueryJson.lte);
    } else if (dateQueryJson.lt) {
        mongoFilter.$lt = dateQueryJson.lt;
//        mongoFilter.$lt = convertUtcStringToJsDate(dateQueryJson.lt);
    }

    if (dateQueryJson.gte) {
        mongoFilter.$gte = dateQueryJson.gte;
//        mongoFilter.$gte = convertUtcStringToJsDate(dateQueryJson.gte);
    } else if (dateQueryJson.gt) {
        mongoFilter.$gt = dateQueryJson.gt;
//        mongoFilter.$gt = convertUtcStringToJsDate(dateQueryJson.gt);
    }
    return mongoFilter;
}

//function convertUtcStringToJsDate(utcDateString) {
//    return moment.utc(utcDateString).toDate();
//}


function convertQueryToMongoFilter(dateQuery) {
    var queryAsJson = convertDateQueryToJson(dateQuery);
    var filter = convertDateJsonToMongoFilter(queryAsJson);
    return filter;
}

exports.createRangeQuery = createRangeQuery;
exports.convertDateQueryToJson = convertDateQueryToJson;
exports.convertDateJsonToMongoFilter = convertDateJsonToMongoFilter;
exports.convertQueryToMongoFilter = convertQueryToMongoFilter;
