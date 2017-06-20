/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import SongsPerDay from './../../src/components/SongsPerDay';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state =require('./../data/initial_state.json');

const mockStore = configureMockStore([]);
describe('<SongsPerDay/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <SongsPerDay error_days={[]}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });
    xit('renders without crashing', () => {
        const err_per_da= [{org:"2017/05/02"}];
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <SongsPerDay error_days={err_per_da}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        // let children =wrapper.find('div#error_list');
        // expect(children.children().key()).toBe("2017/05/02");

    });
});
