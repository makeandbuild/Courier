'use strict';

var should = require('should');
var app = require('./../app');

var dateQueryParser = require('./date.query.parser.js');

describe('Test date query parsing', function () {


    it('test date range query', function (done) {

//        var startDate = '2014-01-01T00%3a00%3a00';
//        var endDate = '2014-01-01T00%3a00%3a00'

        var startDate = '2014-01-01T00:00:00';
        var endDate = '2014-12-31T00:00:00';

        var query = dateQueryParser.createRangeQuery(startDate, endDate);
        var json = dateQueryParser.convertDateQueryToJson(query);
        json.should.have.property('gte', startDate);
        json.should.have.property('lte', endDate);
        done();

    });

});
