/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import Header from "./../../src/components/Header/index";
import Enzyme, {mount, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import {mountToJson, shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";

Enzyme.configure({ adapter: new Adapter() });
const initial_state = require('./../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<Header/>', () => {
  it('renders without crashing ChartPresenter', () => {
    const store = mockStore(initial_state);
    const wrapper = mount(
      <Header/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(mountToJson(wrapper)).toMatchSnapshot();
    let find = wrapper.find('UserInfo').getElements();
    expect(find).toHaveLength(0);
    wrapper.unmount();
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
  it('render user info', () => {
    let state = Object.assign({}, initial_state, { user: { name: 'Simba' } });
    const store = mockStore(state);
    const wrapper = shallow(
      <Header/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    let find = wrapper.find('UserInfo').getElement();
    expect(find.type.name).toBe("UserInfo");
  });
});
