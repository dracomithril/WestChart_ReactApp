/**
 * Created by Gryzli on 07.09.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Button,
  ButtonGroup,
  ControlLabel,
  FormControl,
  FormGroup,
  Image,
} from 'react-bootstrap';

// todo add modal to block usage of tool when playlist crating
class UserPlaylist extends React.Component {
  static mapUserPlaylistToOptions({ id, name, tracks }) {
    const description = `${name} - {${(tracks || {}).total || 0}}`;
    return (
      <option key={id} value={id}>
        {description}
      </option>
    );
  }

  render() {
    const { user, onSelect, onDelete, erasable, onUpdate } = this.props;
    const { items, id, total, pic } = user || {};
    const userPlaylist = (items || []).map(UserPlaylist.mapUserPlaylistToOptions);
    const updateSelectList = ({ target }) => {
      const { name, selectedOptions } = target;
      const sel = Array.from(selectedOptions).map(({ value }) => [name, value]);
      onSelect(name, sel);
    };
    return (
      <FormGroup controlId={`${id}_playlist`} bsClass="playlists_view form-group">
        <div>
          <ControlLabel>
            {' '}
            <Image src={pic} rounded />
            <span>{id.length > 12 ? `${id.substr(0, 9)}...` : id}</span>
          </ControlLabel>
          <Badge bsStyle="warning">{total}</Badge>
          <ButtonGroup>
            <Button className="fa fa-refresh" onClick={() => onUpdate(id)} />
            <Button className="fa fa-minus" onClick={() => onDelete(id)} disabled={!erasable} />
          </ButtonGroup>
        </div>
        <FormControl name={id} componentClass="select" multiple onChange={updateSelectList}>
          {userPlaylist}
        </FormControl>
      </FormGroup>
    );
  }
}

UserPlaylist.propTypes = {
  user: PropTypes.object,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  erasable: PropTypes.bool,
};
export default UserPlaylist;
