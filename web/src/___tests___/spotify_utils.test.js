/**
 * Created by XKTR67 on 4/19/2017.
 */
const sinon = require('sinon');
// import configureMockStore from 'redux-mock-store';
// const mockStore = configureMockStore([]);
describe('[sp_utils]', () => {
    let sp_utils,
        sp_mock = {
            setAccessToken: sinon.spy(),
            createPlaylist: sinon.stub()
        };

    beforeAll(() => {
        jest.mock('cookies-js');
        jest.mock("spotify-web-api-node");
        const sp_apiMock = require("spotify-web-api-node");
        sp_apiMock.mockImplementation(() => sp_mock);
        sp_utils = require('../spotify_utils');
    });
    afterAll(() => {
        jest.unmock('cookies-js');
        jest.unmock("spotify-web-api-node")
    });
    describe('[createPlaylistAndAddTracks]', function () {
        it('should react if no body from spotify', function (done) {
            sp_mock.createPlaylist.returns(Promise.resolve({}));
            sp_utils.createPlaylistAndAddTracks({}, '', false, []).catch(err => {
                expect(err.message).toBe('missing body');
                done();
            });


        });
    });

});
