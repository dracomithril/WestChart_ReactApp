/**
 * Created by Gryzli on 24.01.2017.
 */
/* eslint-env node, mocha, es6 */
let chai = require('chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    assert = sinon.assert,
    expect = chai.expect;
const path = require('path');
let test_body = require('./fbResult.test.json');
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
        requestMock.callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body));
        chart = new Chart();
        assert.calledOnce(UpdateCacheSpy);
        clock.tick(21600000);
        assert.calledTwice(UpdateCacheSpy);
        done();
    });
});



