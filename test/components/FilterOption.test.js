/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import FilteringSettings from "../../src/components/FilteringOptions/FilterOption";
import {shallow} from "enzyme";
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<FilteringSettings/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        let elem = {
            control: {name: "date_create_control", id: 'create'},
            input: {max: 31, name: "create_control"},
            valueName: "created_time",
            description: {start: 'created in last ', end: ' days'},
            type: 'countDays'
        };
        const wrapper = shallow(
            <FilteringSettings {...elem} />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();

    });

});
