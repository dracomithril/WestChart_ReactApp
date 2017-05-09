/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
jest.mock('./../../src/utils');
import PickYourDate from '../../src/components/PickYourDate';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<PickYourDate/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PickYourDate />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PickYourDate />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        let button = wrapper.find('#updateChartB');

        button.simulate('click');
        let actions = store.getActions();
        expect(actions.length).toBe(3);
        console.log(test);
    });
});
