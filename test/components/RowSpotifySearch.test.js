/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import RowSpotifySearch from '../../src/components/RowSpotifySearch';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state =require('../data/initial_state.json');

const mockStore = configureMockStore([]);
describe('<RowSpotifySearch/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        let newVar = {id:0, items:[], selected:[]};
        const wrapper = shallow(
            <RowSpotifySearch search_index={0} search_elem={newVar}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
