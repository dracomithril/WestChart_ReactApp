/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import FilteringOptions from "../../src/front/components/FilteringOptions/index";
import {shallow} from "enzyme";
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<FilteringOptions/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <FilteringOptions />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    xit('should be able to change state of woc checkbox', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <FilteringOptions />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        let btn = wrapper.findWhere(n => n.props().id === 'bFilters').first();
        btn.simulate('click');
        let findWhere = wrapper.findWhere(n => n.props().id === 'woc_cb');
        const wocCheckbox = findWhere.first();
        let woc_props = wocCheckbox.props();
        expect(woc_props.checked).toBeTruthy();
        wocCheckbox.simulate('change',{target:{id:'woc',checked:false}});
        let actions = store.getActions();
        expect(actions[0].type).toBe('TOGGLE_FILTER');
        expect(actions[0].id).toBe('woc');
        expect(actions[0].checked).toBeFalsy();
    })

});
