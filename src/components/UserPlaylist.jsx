/**
 * Created by Gryzli on 07.09.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Image, Badge} from "react-bootstrap";


//todo add modal to block usage of tool when playlist crating
export default class UserPlaylist extends React.Component {
    static mapUserPlaylistToOptions(elem) {
        return <option key={elem.id} value={elem.id}>{elem.name + " - {" + ((elem.tracks || {}).total || 0)+"}"}</option>
    }

    render() {
        let props = this.props;
        let user = props.user || {};
        const items = (user.items || []).map(UserPlaylist.mapUserPlaylistToOptions);
        let updateSelectList = (e) => {
            let name = e.target.name;
            let sel = [];
            for (let el of e.target.selectedOptions) {
                sel.push([name, el.value])
            }
            props.onSelect(name, sel);
        };
        return <FormGroup controlId={user.id + '_playlist'} bsClass="playlists_view form-group">
            <div>
                <ControlLabel> <Image src={user.pic} rounded/>
                    <span>{user.id.length > 12 ? user.id.substr(0, 9) + '...' : user.id}</span>
                </ControlLabel><Badge
                bsStyle="warning">{user.total}</Badge>
                <ButtonGroup>
                    <Button className="fa fa-refresh" onClick={() => props.onUpdate(user.id)}/>
                    <Button className="fa fa-minus" onClick={() => props.onDelete(user.id)} disabled={!props.erasable}/>
                </ButtonGroup>
            </div>
            <FormControl name={user.id} componentClass="select" multiple onChange={updateSelectList}>
                {items}
            </FormControl>
        </FormGroup>
    }
}

UserPlaylist.propTypes = {
    user: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    erasable: PropTypes.bool
};