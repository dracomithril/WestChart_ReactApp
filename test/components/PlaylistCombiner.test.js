/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from "react";
import PropTypes from "prop-types";
import PlaylistCombiner from "./../../src/components/PlaylistCombiner";
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallowToJson} from "enzyme-to-json";
import configureMockStore from "redux-mock-store";

Enzyme.configure({ adapter: new Adapter() });
// const sinon = require('sinon');
jest.mock('./../../src/spotify_utils');
const initial_state = require('./../data/initial_state.json');
const mockStore = configureMockStore([]);
xdescribe('<PlaylistCombiner/>', () => {
  it('renders without crashing ChartPresenter', (done) => {
    // let sp = require('./../../src/front/spotify_utils');
    // let stub = sinon.stub();
    initial_state.sp_user.id = 'smoczek';
    const store = mockStore(initial_state);

    const wrapper = shallow(
      <PlaylistCombiner/>, {
        context: { store },
        childContextTypes: { store: PropTypes.object }
      }
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    done();
  });


});
