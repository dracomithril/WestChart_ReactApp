/**
 * Created by Gryzli on 23.04.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

const FilterOption = ({ control, input, description }, { store }) => {
  const { filters } = store.getState();
  return (
    <Checkbox
      {...control}
      checked={filters[input.name].checked}
      onChange={({ target }) => {
        const { id, checked } = target;
        store.dispatch({ type: 'TOGGLE_FILTER', id, checked });
      }}
    >
      {description.start}
      <input
        className="num_days"
        type="number"
        min={0}
        step={1}
        id={control.id}
        value={filters[input.name].days}
        onChange={({ target }) => {
          const { id, name, value } = target;
          store.dispatch({
            type: 'UPDATE_DAYS',
            id,
            name,
            value: Number(value),
          });
        }}
      />
      {description.end}
    </Checkbox>
  );
};
FilterOption.contextTypes = {
  store: PropTypes.object,
};
FilterOption.propTypes = {
  control: PropTypes.object,
  input: PropTypes.object,
  description: PropTypes.object,
};
export default FilterOption;
