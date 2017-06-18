/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import PlaylistCombiner from "../../src/front/components/PlaylistCombiner";
import {shallow} from "enzyme";
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";
jest.mock('./../../src/front/spotify_utils');
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<PlaylistCombiner/>', () => {
    it('renders without crashing ChartPresenter', () => {
        let sp = require('./../../src/front/spotify_utils');

        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PlaylistCombiner view_chart={[]}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });

});
