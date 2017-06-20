/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Footer from './../../src/components/Footer';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([]);
describe('<Footer/>', () => {
    it('renders without crashing', () => {
        const store = mockStore({});
        const wrapper = shallow(
            <Footer />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });
});
