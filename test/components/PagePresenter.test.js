/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {shallow} from "enzyme";
import {shallowToJson} from "enzyme-to-json";
jest.mock('./../../src/utils');
import configureMockStore from "redux-mock-store";
const initial_state = require('../data/initial_state.json');
const chartData = require('../data/response.json').chart;
import PagePresenter from "../../src/components/PagePresenter";

const mockStore = configureMockStore([]);

describe('<PagePresenter/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PagePresenter />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.children().node).toBeUndefined();
    });
    it('renders with isGroupAdmin=true', () => {
        let state = Object.assign({},initial_state,{user:{isGroupAdmin:true}});
        const store = mockStore(state);
        const wrapper = shallow(
            <PagePresenter />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.children().props().id).toBe("groupAdmin");
    });
    it('should obtain chart objects', () => {
        const utils = require('./../../src/utils');
        utils.filterChart.mockReturnValue([]);
        let state = Object.assign({},initial_state,{user:{isGroupAdmin:true}, chart:chartData});
        const store = mockStore(state);
        const wrapper = shallow(
            <PagePresenter />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.children().props().id).toBe("groupAdmin");
    });
});
