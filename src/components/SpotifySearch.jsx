/**
 * Created by Gryzli on 09.04.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import PlaylistForm from './PlaylistForm';
import RowSpotifySearch from './RowSpotifySearch';
import PlaylistInfo from './PlaylistInfo';

export default class SpotifySearch extends React.Component {
  /* istanbul ignore next */
  componentDidMount() {
    console.info('component SpotifySearch did mount');
  }
  /* istanbul ignore next */
  componentWillUnmount() {
    console.info('component SpotifySearch unmounted');
  }

  render() {
    const { store } = this.context;
    const { search_list, sp_playlist_info } = store.getState();
    const search_list_view = search_list.map(search_elem => (
      <RowSpotifySearch search_elem={search_elem} key={search_elem.id} />
    ));
    return (
      <div>
        <h3 id="list">
          {'Create '}
          <i className="fa fa-spotify" aria-hidden="true">
            Spotify playlist:
          </i>
          <PlaylistInfo info={sp_playlist_info} />
          <PlaylistForm {...this.props} />
        </h3>
        {search_list_view.length > 0 && (
          <table style={{ marginLeft: 10 }}>
            <thead>
              <tr>
                <th>Artist & Title</th>
                <th>Options:</th>
                <th>Selected:</th>
              </tr>
            </thead>
            <tbody>{search_list_view}</tbody>
          </table>
        )}
      </div>
    );
  }
}
SpotifySearch.contextTypes = {
  store: PropTypes.object,
};
SpotifySearch.propTypes = {
  selected: PropTypes.array,
};
