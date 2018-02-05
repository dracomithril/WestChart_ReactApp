/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ChartTable from './../../src/components/ChartTable';
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {mountToJson, shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });
const initial_state = require('./../data/initial_state.json');
const data = require('./../data/response.json').chart;
const mockStore = configureMockStore([]);

describe('<ChartTable/>', () => {
  it('renders without crashing', () => {
    const store = mockStore(initial_state);
    const wrapper = shallow(
      <ChartTable data={[]}/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });
  it('render with objects', () => {
    const store = mockStore(initial_state);
    const wrapper = mount(
      <ChartTable data={data}/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
