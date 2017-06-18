/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ChartPresenter from '../../src/front/components/ChartPresenter';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state =require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<ChartPresenter/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <ChartPresenter view_chart={[]}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });

});
