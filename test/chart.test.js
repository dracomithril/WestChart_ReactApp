/**
 * Created by Gryzli on 24.01.2017.
 */
/* eslint-env node, mocha, es6 */
let chai = require('chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    assert = sinon.assert,
    expect = chai.expect;
let test_body = require('./data/fbResult.json');
let test_body2 = require('./data/fbResult2.json');
//let test_body3 = require('./data/fbResult3.json');
chai.should();

describe('[chart]', function () {
    let Chart, chart, clock;
    let requestMock = sinon.stub();

    before(function () {
        const date = new Date('2017-03-03T23:00:00');
        clock = sinon.useFakeTimers(date.getTime());
        Chart = rewire('../src/chart');
        Chart.__set__('request', requestMock);
    });
    after(function () {
        clock.restore();
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it('should be able to obtain list from chart', function (done) {
        let groupId='1707149242852457';
        requestMock.withArgs(sinon.match.object).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body));
        requestMock.withArgs(test_body.paging.next).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body2));
        //requestMock.withArgs(test_body2.paging.next).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body3));
        chart = new Chart(10, 31);
        chart.on('change', function (body) {
            assert.calledTwice(requestMock);
            expect(body.chart.length).to.eql(97);
            done();
        });
        let date = new Date();
        let since_date = new Date(date.toISOString());
        since_date.setDate(date.getDate() - 31);

        chart.UpdateChart(since_date.toISOString(), date.toISOString(), '', groupId);
    });
});



