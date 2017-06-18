/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import PickYourDate from "../../src/front/components/PickYourDate";
import {shallow} from "enzyme";
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";
jest.mock('./../../src/front/utils');
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<PickYourDate/>', () => {
    afterAll(() => {
        jest.unmock('./../../src/utils');
    });
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PickYourDate />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    xit('is able to click btn', () => {
        const store = mockStore(initial_state);
        const utils = require('../../src/front/utils');
        const wrapper = shallow(
            <PickYourDate />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        let button = wrapper.find('#updateChartB');

        button.simulate('click');
        let actions = store.getActions();
        expect(actions.length).toBe(0);
        expect(utils.UpdateChart.mock.calls.length).toBe(1);
    });
});
