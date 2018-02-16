/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import FilteringOption from "./../../components/FilteringOptions/FilterOption";
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";

Enzyme.configure({ adapter: new Adapter() });
const initial_state = require('../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<FilteringOption/>', () => {
  let elem = {
    control: { name: "date_create_control", id: 'create' },
    input: { max: 31, name: "create_control" },
    valueName: "created_time",
    description: { start: 'created in last ', end: ' days' },
    type: 'countDays'
  };
  it('renders without crashing ChartPresenter', () => {
    const store = mockStore(initial_state);
    const wrapper = shallow(
      <FilteringOption {...elem} />, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });
  it('should be able to change state of woc checkbox', () => {
    const store = mockStore(initial_state);
    const wrapper = shallow(
      <FilteringOption {...elem} />, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    const wocCheckbox = wrapper.findWhere(n => n.props().id === 'create').first();
    expect(wocCheckbox.props().checked).toBeTruthy();
    wocCheckbox.simulate('change', { target: { id: 'create', checked: false } });
    let actions = store.getActions();
    expect(actions[0].type).toBe('TOGGLE_FILTER');
    expect(actions[0].id).toBe('create');
    expect(actions[0].checked).toBeFalsy();

  })

});
