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
let fs = require("fs");
chai.should();

describe('[chart]', function () {
    let Chart, chart, UpdateCacheSpy,clock;
    let requestMock = sinon.stub();
    let body = fs.readFileSync(path.resolve('./test', './data/fbResult.json'), 'utf8');
    before(function () {
        clock = sinon.useFakeTimers();
        Chart = rewire('../server/chart');
        Chart.__set__('request', requestMock);
        let update = Chart.__get__('UpdateChart');
        UpdateCacheSpy= sinon.spy(update);
Chart.__set__('UpdateChart',UpdateCacheSpy);
    });
    after(function () {
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it('should be able to obtain list from chart', function (done) {
        requestMock.callsArgWith(1, undefined, {statusCode: 200}, body);
        chart = new Chart();
       assert.calledOnce(UpdateCacheSpy);
       clock.tick(21600000);
       assert.calledTwice(UpdateCacheSpy);
       done();
    });
});



