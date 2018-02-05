import React from 'react';
import PropTypes from 'prop-types';
import App from './../../src/App';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state =require('./../data/initial_state.json');

const middlewares = [];
const mockStore = configureMockStore(middlewares);
describe('<App/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <App />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
