/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Footer from './../../src/components/Footer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureMockStore([]);
describe('<Footer/>', () => {
  it('renders without crashing', () => {
    process.env.npm_package_version = "0.6.3";
    const store = mockStore({});
    const wrapper = shallow(
      <Footer/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });
});
