/**
 * Created by XKTR67 on 10/21/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import NewsLetter from "../../src/components/NewsLetter";
const initial_state =require('./../data/initial_state.json');
const westletters_state =require('./../data/WestLetter.json');
const mockStore = configureMockStore([]);
describe('<NewsLetter/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <NewsLetter data={[]}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });
    it('renders users', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <NewsLetter data={westletters_state}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });

});