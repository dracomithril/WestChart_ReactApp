/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import Header from "../../src/front/components/Header/index";
import {shallow, mount} from "enzyme";
import { mountToJson, shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<Header/>', () => {
    it('renders without crashing ChartPresenter', () => {
        const store = mockStore(initial_state);
        const wrapper = mount(
            <Header />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(mountToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('UserInfo').node).toBeUndefined();
        wrapper.unmount();
        expect(mountToJson(wrapper)).toMatchSnapshot();
    });
    it('render user info', () => {
        let state = Object.assign({},initial_state, {user:{name:'Simba'}});
        const store = mockStore(state);
        const wrapper = shallow(
            <Header />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('UserInfo').node.type.name).toBe("UserInfo");
    });
});
