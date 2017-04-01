/**
 * Created by Gryzli on 24.01.2017.
 */
/* eslint-env node, mocha, es6 */
let chai = require('chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    assert = sinon.assert,
    expect = chai.expect;
let Promise = require("bluebird");
let test_body = require('./data/fbResult.json');
let test_body2 = require('./data/fbResult2.json');
chai.should();

describe('[chart]', function () {
    let Chart, chart, clock;
    let requestMock = {
        getAsync: sinon.stub()
    };
    before(function () {
        const date = new Date('2017-03-03T23:00:00');
        clock = sinon.useFakeTimers(date.getTime());
        Chart = rewire('../server/chart');
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
        let groupId = '1707149242852457';
        const body1 = {
            statusCode: 200,
            body: JSON.stringify(test_body)
        };
        const body2 = {
            statusCode: 200,
            body: JSON.stringify(test_body2)
        };
        requestMock.getAsync.withArgs(sinon.match.object).returns(Promise.resolve(body1));//callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body));
        requestMock.getAsync.withArgs(test_body.paging.next).returns(Promise.resolve(body2));//callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body2));
        //requestMock.withArgs(test_body2.paging.next).callsArgWith(1, undefined, {statusCode: 200}, JSON.stringify(test_body3));
        //chart = new Chart(10, 31);
        // chart.on('change', function (body) {
        //
        // });
        let date = new Date();
        let since_date = new Date(date.toISOString());
        since_date.setDate(date.getDate() - 31);

        Chart(31, since_date.toISOString(), date.toISOString(), '', groupId).then((res) => {
            assert.calledTwice(requestMock.getAsync);
            expect(res.chart.length).to.eql(97);
            done();
        }).catch((err) => {
            assert.calledTwice(requestMock.getAsync);
            done();
        });
    });
});



