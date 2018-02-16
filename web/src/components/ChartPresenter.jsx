/**
 * Created by Gryzli on 06.04.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import Summary from './Summary';
import ChartTable from './ChartTable';
import ChartHeader from './ChartHeader';
import SpotifySearch from './SpotifySearch';
import WestLetter from './WestLetter';

const { sorting, filterChart } = require('./../utils');

const ChartPresenter = (props, { store }) => {
  const { list_sort, chart, filters, until, songs_per_day } = store.getState();
  const defaultValue = {
    view_chart: [],
    error_days: [],
    westLetters: [],
  };
  const { view_chart, error_days, westLetters } =
    chart.length > 0 ? filterChart(chart, filters, until, songs_per_day) : defaultValue;
  const selected = view_chart.filter(elem => elem.selected);
  sorting[list_sort](selected);
  return (
    <div>
      <Tabs defaultActiveKey={0} id="chart_tabs">
        <Tab eventKey={0} title={<i className="fa fa-facebook">Posts</i>}>
          <ChartHeader error_days={error_days} view_chart={view_chart} />
          <ChartTable data={view_chart} />
        </Tab>
        <Tab
          eventKey={1}
          title={
            <i className="fa fa-spotify" id="chart_playlist_tab">
              Playlist
            </i>
          }
        >
          <SpotifySearch selected={selected} />
        </Tab>
        <Tab eventKey={2} title={<i className="fa fa-list">Summary</i>}>
          <Summary selected={selected} />
        </Tab>
        <Tab eventKey={3} title={<i className="fa fa-table">West Letters</i>}>
          <WestLetter data={westLetters} />
        </Tab>
      </Tabs>
    </div>
  );
};
ChartPresenter.contextTypes = {
  store: PropTypes.object,
};
export default ChartPresenter;
