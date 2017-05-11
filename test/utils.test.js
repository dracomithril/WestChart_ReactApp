/**
 * Created by XKTR67 on 4/19/2017.
 */
const sinon = require('sinon');
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore([]);
describe('[utils]', () => {
    let utils;
    beforeAll(() => {
        jest.mock('cookies-js');
        utils = require('./../src/utils');
    });
    afterAll(() => {
        jest.unmock('cookies-js');
    });
    beforeEach(() => {
    });
    afterEach(() => {
    });
    describe('[sorting]', () => {
        let base_array = [{
            from_user: "krzys",
            reactions_num: 7,
            added_time: new Date('2017-03-14'),
            link: {
                name: 'acbaa'
            }
        }, {
            from_user: "bartek",
            reactions_num: 3,
            added_time: new Date('2017-03-16'),
            link: {
                name: 'acbaa'
            }
        }, {
            from_user: "zumba",
            reactions_num: 9,
            added_time: new Date('2017-04-14'),
            link: {
                name: 'aabcaa'
            }
        }, {
            from_user: 'tomek',
            reactions_num: 0,
            added_time: undefined,
            link: {
                name: 'zzzaaaa'
            }
        }, {
            from_user: 'tomek',
            reactions_num: 1,
            added_time: new Date('2017-02-19'),
            link: {
                name: 'tttaaaa'
            }
        }];
        it("reaction dsc", () => {
            let array = Object.assign([], base_array);
            utils.sorting.reaction(array);
            expect(array[0].reactions_num).toBe(9);
            expect(array[1].reactions_num).toBe(7);
            expect(array[2].reactions_num).toBe(3);
            expect(array[3].reactions_num).toBe(1);
        });
        it('who asc', function () {
            let array = Object.assign([], base_array);
            utils.sorting.who(array);
            expect(array[0].from_user).toBe("bartek");
            expect(array[1].from_user).toBe("krzys");
            expect(array[2].from_user).toBe("tomek");
            expect(array[3].from_user).toBe("tomek");
            expect(array[4].from_user).toBe("zumba");
        });
        it('when', function () {
            let array = Object.assign([], base_array);
            utils.sorting.when(array);
            expect(array[0].from_user).toBe("tomek");
            expect(array[0].added_time).toBeUndefined();
            expect(array[1].from_user).toBe("tomek");
            expect(array[2].from_user).toBe("krzys");
            expect(array[3].from_user).toBe("bartek");
            expect(array[4].from_user).toBe("zumba");
        });
        it('what', function () {
            let array = Object.assign([], base_array);
            utils.sorting.what(array);
            expect(array[0].from_user).toBe("zumba");
            expect(array[1].from_user).toBe("krzys");
            expect(array[2].from_user).toBe("bartek");
            expect(array[3].from_user).toBe("tomek");
            expect(array[4].from_user).toBe("tomek");
            expect(array[4].added_time).toBeUndefined();
        });

    });
    describe('[loginToSpotify]', function () {
        it('should be able to react for server response', function () {
            let fetch = sinon.stub(window, 'fetch');
            let assign = sinon.spy(window.location, 'assign');
            let CookiesMock = require('cookies-js');
            CookiesMock.set = sinon.spy();
            const resp = {
                text: sinon.stub(),
                json:sinon.stub()
            };
            const state = "azasaswwaadda";
            let path = `http://someurl.com/text?state=${state}`;
            resp.text.returns(Promise.resolve(path));
            fetch.withArgs('/api/login').returns(Promise.resolve(resp));
            return utils.loginToSpotify().then(() => {
                sinon.assert.calledOnce(assign);
                sinon.assert.calledWith(assign, path);
                sinon.assert.calledOnce(CookiesMock.set);
                sinon.assert.calledWith(CookiesMock.set, sinon.match.string, sinon.match(state));
                window.fetch.restore();
                window.location.assign.restore();
            })
        });
    });
    describe('[get_chart_from_server]', function () {
        it('get list', function () {
            const store = mockStore();
            let fetch = sinon.stub(window, 'fetch');
            let CookiesMock = require('cookies-js');
            CookiesMock.set = sinon.spy();
            const resp = {
                text: sinon.stub(),
                json:sinon.stub(),
                status:200
            };
            resp.json.returns(Promise.resolve({chart:[], last_update:''}));
            fetch.withArgs('api/get_chart?').returns(Promise.resolve(resp));
            return utils.get_chart_from_server({},store).then(() => {
                expect(store.getActions().length).toBe(3);
                window.fetch.restore();
            })
        });
    });

});