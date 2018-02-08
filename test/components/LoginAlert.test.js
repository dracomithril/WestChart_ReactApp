/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import LoginAlert from './../../src/components/LoginAlert/index';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });
const initial_state = require('./../data/initial_state.json');
const mockStore = configureMockStore([]);
describe('<LoginAlert/>', () => {
  beforeAll(() => {
    global.sessionStorage = jest.genMockFunction();
    global.sessionStorage.setItem = jest.genMockFunction();
    global.sessionStorage.getItem = jest.genMockFunction();
  });
  afterAll(() => {
    delete global.sessionStorage;
  });
  it('renders without crashing ChartPresenter', () => {
    const store = mockStore(initial_state);
    const wrapper = shallow(
      <LoginAlert location={{state:'some_path'}} />, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });

});
