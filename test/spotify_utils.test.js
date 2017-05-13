/**
 * Created by XKTR67 on 4/19/2017.
 */
const sinon = require('sinon');
// import configureMockStore from 'redux-mock-store';
// const mockStore = configureMockStore([]);
describe('[sp_utils]', () => {
    let sp_utils;
    beforeAll(() => {
        jest.mock('cookies-js');
        sp_utils = require('./../src/spotify_utils');
    });
    afterAll(() => {
        jest.unmock('cookies-js');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    describe('[loginToSpotify]', function () {
        it('should be able to react for server response', function () {
            let fetch = sinon.stub(window, 'fetch');
            let assign = sinon.spy(window.location, 'assign');
            let CookiesMock = require('cookies-js');
            CookiesMock.set = sinon.spy();
            const resp = {
                text: sinon.stub(),
                json: sinon.stub()
            };
            const state = "azasaswwaadda";
            let path = `http://someurl.com/text?state=${state}`;
            resp.text.returns(Promise.resolve(path));
            fetch.withArgs('/api/login').returns(Promise.resolve(resp));
            return sp_utils.loginToSpotify().then(() => {
                sinon.assert.calledOnce(assign);
                sinon.assert.calledWith(assign, path);
                sinon.assert.calledOnce(CookiesMock.set);
                sinon.assert.calledWith(CookiesMock.set, sinon.match.string, sinon.match(state));
                window.fetch.restore();
                window.location.assign.restore();
            })
        });
    });

});