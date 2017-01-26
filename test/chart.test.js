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
let test_body3 = require('./data/fbResult3.json');
chai.should();

describe('[chart]', function () {
    let Chart, chart, UpdateCacheSpy, clock;
    let requestMock = sinon.stub();

    before(function () {
        clock = sinon.useFakeTimers(new Date('2017-01-24T11:00:00').getTime());
        Chart = rewire('../src/chart');
        Chart.__set__('request', requestMock);
        let update = Chart.__get__('_updateChart');
        UpdateCacheSpy = sinon.spy(update);
        Chart.__set__('_updateChart', UpdateCacheSpy);
    });
    after(function () {
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it('should be able to obtain list from chart', function (done) {
        requestMock.withArgs(sinon.match.object).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body));
        requestMock.withArgs(test_body.paging.next).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body2));
        requestMock.withArgs(test_body2.paging.next).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body3));

        chart = new Chart();
        chart.on('change', function (body) {
            if (UpdateCacheSpy.callCount === 1) {
                assert.calledOnce(UpdateCacheSpy);
                expect(body.chart.length).to.eql(94);
            }
            if (UpdateCacheSpy.callCount === 2) {
                assert.calledTwice(UpdateCacheSpy);
                expect(body.chart.length).to.eql(94);
                done();
            }
        });
        let date = new Date();
        let since_date = new Date();
        since_date.setDate(date.getDate() - 14);
        chart.UpdateChart(since_date.toISOString(), date.toISOString());
        clock.tick(2160000);
    });
});



