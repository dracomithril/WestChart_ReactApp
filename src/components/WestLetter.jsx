/**
 * Created by Gryzli on 21.10.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import utils from '../utils';

export default class WestLetter extends React.Component {
  componentDidMount() {
    console.info('component WestLetter did mount');
  }
  componentWillUnmount() {
    console.info('component WestLetter unmounted');
  }
  render() {
    const westLetter = this.props.data;
    const today = new Date();
    const today_week = utils.weekInfo(today);
    const show = westLetter.map(elem => {
      const create_date = new Date(elem.created_time);
      const { weekNumber } = utils.weekInfo(create_date);
      return (
        <div style={{ padding: 2, display: 'block', border: '1px black solid' }} key={elem.id}>
          <input type="checkbox" />
          <span hidden>{elem.id}</span>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tt_${elem.id}`}>{elem.from_user}</Tooltip>}
          >
            <Image src={utils.getFbPictureUrl(elem.from.id)} />
          </OverlayTrigger>

          <div>
            <span>{create_date.toLocaleDateString()}</span>
            <br />
            <span>week:{weekNumber}</span>
            <br />
            <span>is added</span>
          </div>
        </div>
      );
    });
    return (
      <div>
        <div className="beta">
          <h1>This site is still in BeTa version</h1>
          <h2>Soon we will be able to track WestLetters in each week ;)</h2>
        </div>

        <h4>
          We have {today_week.weekNumber} week of {today.getFullYear()}
        </h4>
        <div style={{ display: 'inline-flex' }}>{show}</div>
      </div>
    );
  }
}
WestLetter.propTypes = {
  data: PropTypes.array,
};
WestLetter.contextTypes = {
  store: PropTypes.object,
};
