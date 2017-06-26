/**
 * Created by XKTR67 on 2017-06-26.
 */
import reducers from "./../src/reducers/reducers";
const action_types = require('./../src/reducers/action_types');
describe('[reducers]', function () {

    beforeAll(() => {
    });
    afterAll(() => {
        jest.unmock('moment');
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    describe('last_update', function () {
        it("should replace current state by new value", function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = '';
            Object.freeze(state);
            let resp = reducers.last_update(state, {type: action_types.UPDATE_LAST_UPDATE, date: date})
            expect(resp).toBe(date);
        });
        it('should return current state if type don\'t match', function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = undefined;
            Object.freeze(state);
            let resp = reducers.last_update(state, {type: action_types.TOGGLE_HAS_COOKIE, date: date})
            expect(resp).toBe('');
        });
        //todo  improve to check if it's date string
    });
    describe('show_wait', function () {
        it('should replace current state by new value', function () {
            const show_wait = false;
            const state = true;
            Object.freeze(state);
            let resp = reducers.show_wait(state, {type: action_types.CHANGE_SHOW_WAIT, show: show_wait})
            expect(resp).toBe(show_wait);
        });
        it('should return current state if type don\'t match', function () {
            const date = "zzz";
            const state = undefined;
            Object.freeze(state);
            let resp = reducers.show_wait(state, {type: action_types.TOGGLE_HAS_COOKIE, show: date})
            expect(resp).toBe(false);
        });
    });
    describe('start_date', function () {
        //todo type check
        it("should replace current state by new value", function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = new Date('2017-06-06');
            Object.freeze(state);
            let resp = reducers.start_date(state, {type: action_types.UPDATE_START_TIME, date: date})
            expect(resp).toBe(date);
        });
        it('should return current state if type don\'t match', function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = new Date('2017-06-06');
            Object.freeze(state);
            let resp = reducers.start_date(state, {type: action_types.TOGGLE_HAS_COOKIE, date: date});
            expect(resp).toBe(state);
        });
    });
    describe('since', function () {
        it("should replace current state by new value", function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = '';
            Object.freeze(state);
            let resp = reducers.since(state, {type: action_types.UPDATE_SINCE, date: date})
            expect(resp).toBe(date);
        });
        it('should return current state if type don\'t match', function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = undefined;
            Object.freeze(state);
            let resp = reducers.since(state, {type: action_types.TOGGLE_HAS_COOKIE, date: date})
            expect(resp).toBe('');
        });
        //todo  improve to check if it's date string
    });
    describe('until', function () {
        it("should replace current state by new value", function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = '';
            Object.freeze(state);
            let resp = reducers.until(state, {type: action_types.UPDATE_UNTIL, date: date})
            expect(resp).toBe(date);
        });
        it('should return current state if type don\'t match', function () {
            const date = "2017-06-16T19:54:25.672Z";
            const state = undefined;
            Object.freeze(state);
            let resp = reducers.until(state, {type: action_types.TOGGLE_HAS_COOKIE, date: date})
            expect(resp).toBe('');
        });
        //todo  improve to check if it's date string
    });
    describe('songs_per_day', function () {
        it("should replace current state by new value", function () {
            const state = '';
            Object.freeze(state);
            let resp = reducers.songs_per_day(state, {type: action_types.UPDATE_SONGS_PER_DAY, days: 3});
            expect(resp).toBe(3);
        });
        it('should return current state if type don\'t match', function () {

            const state = undefined;
            Object.freeze(state);
            let resp = reducers.songs_per_day(state, {type: action_types.TOGGLE_HAS_COOKIE, days: 3});
            expect(resp).toBe(2);
        });
        //todo  improve to check if it's date string
    });
    describe('show_last', function () {
        it("should replace current state by new value", function () {
            const state = 20;
            Object.freeze(state);
            let resp = reducers.show_last(state, {type: action_types.UPDATE_SHOW_LAST, days: 33});
            expect(resp).toBe(33);
        });
        it('should return current state if type don\'t match', function () {

            const state = undefined;
            Object.freeze(state);
            let resp = reducers.show_last(state, {type: action_types.TOGGLE_HAS_COOKIE, days: 3});
            expect(resp).toBe(31);
        });
        //todo  improve to check if it's date string
    });
    describe('user', function () {
        it("should return current state if response have error", function () {
            const state = {};
            const user = {
                error: {message: 'error'}
            };
            Object.freeze(state);
            let resp = reducers.user(state, {type: action_types.UPDATE_USER, response: user});
            expect(resp).toBe(state);
        });
        it("should return current state if different type used", function () {
            const state = {};
            const user = {
                error: {message: 'error'}
            };
            Object.freeze(state);
            let resp = reducers.user(state, {type: action_types.UPDATE_SHOW_LAST, response: user});
            expect(resp).toBe(state);
        });
        it("should return updated user", function () {
            const state = {};
            const user = {
                accessToken: 'zzzzz',
                email: 'email',
                first_name: 'Zuza',
                expiresIn: 'some date',
                id: 'zzzz1',
                name: 'Graba',
                signedRequest: 'dgaskdashd',
                userID: 'zzzz1',
                picture: {data: {url: 'http://zzzz1'}},
                groups: {
                    data: [
                        {
                            id: '1707149242852457',
                            administrator: true
                        }
                    ]
                }
            };
            const result = {
                accessToken: 'zzzzz',
                email: 'email',
                first_name: 'Zuza',
                expiresIn: 'some date',
                id: 'zzzz1',
                name: 'Graba',
                signedRequest: 'dgaskdashd',
                userID: 'zzzz1',
                picture_url: 'http://zzzz1',
                isGroupAdmin: true
            };
            Object.freeze(state);
            let resp = reducers.user(state, {type: action_types.UPDATE_USER, response: user});
            expect(resp).toEqual(result);
        });
    });

});