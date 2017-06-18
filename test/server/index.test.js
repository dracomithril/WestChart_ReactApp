/**
 * Created by Gryzli on 18.06.2017.
 */
/* eslint-env node, es6 */
const sinon =require('sinon');
describe('[server]', function () {
    let server;
    let expressMock={
        use:sinon.stub(),
        get:sinon.stub(),
        listen: sinon.stub()
    };
    beforeAll(() => {

    });
    afterAll(() => {
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("check if server started", function () {
        jest.mock('express');
        let express= require('express');
        express.mockImplementation(()=>expressMock);
        server = require('../../src/server');

        sinon.assert.calledOnce(expressMock.listen);
        sinon.assert.callCount(expressMock.get,5);
        sinon.assert.callCount(expressMock.use,2);
    });
});