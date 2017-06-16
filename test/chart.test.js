/**
 * Created by Gryzli on 24.01.2017.
 */
/* eslint-env node, mocha, es6 */
let sinon = require('sinon'),
    rewire = require('rewire'),
    assert = sinon.assert;
let Promise = require("bluebird");
let test_body = require('./data/fbResult.json');
let test_body2 = require('./data/fbResult2.json');

describe('[chart]', function () {
    let Chart, clock;
    let requestMock = {
        getAsync: sinon.stub()
    };
    beforeAll(() =>{
        const date = new Date('2017-03-03T23:00:00');
        clock = sinon.useFakeTimers(date.getTime());
        Chart = rewire('./server/chart');
        Chart.__set__('request', requestMock);
    });
    afterAll(() =>{
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
            body: test_body
        };
        let options = {
            "uri": "/v2.9/1707149242852457/feed",
            "baseUrl": "https://graph.facebook.com",
            "qs": {
                "fields": "story,from,link,caption,icon,created_time,source,name,type,message,attachments,full_picture,updated_time,likes.limit(1).summary(true),reactions.limit(1).summary(true),comments.limit(50).summary(true){message,from}",
                "limit": 100,
                "access_token": "",
                "since": "2017-01-31T23:00:00.000Z",
                "until": "2017-03-03T23:00:00.000Z"
            },
            "port": 443,
            "path": "/v2.9/1707149242852457/feed",
            "method": "GET",
            "timeout": 9000,
            "simple": true,
            "json": true,
            "resolveWithFullResponse": false
        };
        const body2 = {
            statusCode: 200,
            body: test_body2
        };
        requestMock.getAsync.withArgs(sinon.match(options)).returns(Promise.resolve(body1));
        requestMock.getAsync.withArgs(sinon.match({url: test_body.paging.next})).returns(Promise.resolve(body2));
        let date = new Date();
        let since_date = new Date(date.toISOString());
        since_date.setDate(date.getDate() - 31);

        return Chart(31, since_date.toISOString(), date.toISOString(), '', groupId).then((res) => {
            assert.calledOnce(requestMock.getAsync);
            expect(res.chart.length).toEqual(97);
            done();
        })
    });
});



