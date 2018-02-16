import React from 'react';
import PropTypes from 'prop-types';
import App from './../../App';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });
const initial_state = require('../data/initial_state.json');

const middlewares = [];
const mockStore = configureMockStore(middlewares);
describe('<App/>', () => {
  it('renders without crashing', () => {
    const store = mockStore(initial_state);
    const wrapper = shallow(
      <App/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
