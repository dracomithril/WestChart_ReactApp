/**
 * Created by Gryzli on 18.06.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ChartHeader from './../../src/components/ChartHeader';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state =require('./../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<ChartHeader/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <ChartHeader error_days={[]}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });

});