/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FilterOption from './FilterOption';
import './FilteringOptions.css';
import filters_def from './../../filters_def';

const _ = require('lodash');
const action_types = require('./../../reducers/action_types');

const MessageControl = ({ input: { name }, text, control }, { store }) => {
  const { filters } = store.getState();
  return (
    <Checkbox
      checked={!filters[name].checked}
      onChange={({ target }) => {
        const { id, checked } = target;
        store.dispatch({ type: action_types.TOGGLE_FILTER, id, checked: !checked });
      }}
      {...control}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`${name}_tp`}>{`Will show all [${text}]`}</Tooltip>}
      >
        <span>[{text}]</span>
      </OverlayTrigger>
    </Checkbox>
  );
};

MessageControl.contextTypes = {
  store: PropTypes.object,
};
MessageControl.propTypes = {
  input: PropTypes.object,
  text: PropTypes.string,
  control: PropTypes.object,
};

const FilteringOptions = () => {
  const map_c = filters_def.control.map(elem => <FilterOption {...elem} key={elem.input.name} />);
  const map_t = filters_def.text.map(elem => <MessageControl {...elem} key={elem.input.name} />);
  const combined_map = [...map_t, ...map_c];
  const chunk_combined_map = _.chunk(combined_map, Math.floor(combined_map.length / 2));
  return (
    <div style={{ display: '-webkit-box' }}>
      <div className="filter_panel">{chunk_combined_map[0]}</div>
      <div className="filter_panel">{chunk_combined_map[1]}</div>
    </div>
  );
};
export default FilteringOptions;
