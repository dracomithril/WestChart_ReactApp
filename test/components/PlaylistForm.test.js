/**
 * Created by XKTR67 on 4/19/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
jest.mock('./../../src/spotify_utils');
import PlaylistForm from './../../src/components/PlaylistForm';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
const initial_state = require('./../data/initial_state.json');
const data = require('./../data/response.json').chart;
const sinon = require('sinon');
const mockStore = configureMockStore([]);

describe('<PlaylistForm/>', () => {
    it('renders without crashing', () => {
        const store = mockStore(initial_state);
        const wrapper = shallow(
            <PlaylistForm />, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('start_click', (done) => {
        const sp_utils= require('./../../src/spotify_utils');
        sp_utils.searchForMusic.mockReturnValue(Promise.resolve({id:'zzz', value:{}}));
        const state = Object.assign({}, initial_state, {sp_playlist_name: "test_list_zzzz"});
        const store = mockStore(state);
        const wrapper = shallow(
            <PlaylistForm selected={data}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        let start_b = wrapper.find('#start_sp_button');
        start_b.simulate('click');
        expect(store.getActions().length).toBe(1);
        done();
    });
    it('createPlaylistAndAddTracks', () => {
        const sp_utils = require('./../../src/spotify_utils');
        sp_utils.createPlaylistAndAddTracks.mockReturnValue(Promise.resolve({mock:'mock'}));
        const state = Object.assign({}, initial_state, {sp_playlist_name: "test_list_zzzz"});
        const store = mockStore(state);
        const wrapper = shallow(
            <PlaylistForm selected={data}/>, {
                context: {store},
                childContextTypes: {store: PropTypes.object}
            }
        );

        let elem = wrapper.find('#play_list_is_private');
        let getElemByIdStub = sinon.stub();
        getElemByIdStub.withArgs('play_list_is_private').returns(elem);
        //document.getElementById = getElemByIdStub;
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        let start_b = wrapper.find('#crt_pl_button');
        start_b.simulate('click');
        expect(store.getActions().length).toBe(0);
        expect(sp_utils.createPlaylistAndAddTracks.mock.calls.length).toBe(1);
    })
});
