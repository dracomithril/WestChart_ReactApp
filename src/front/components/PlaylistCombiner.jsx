/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Image} from "react-bootstrap";
import {getUserAndPlaylists} from "./../spotify_utils";


const UserPlaylist = (props) => {
    let user = props.user || {};
    const items = (user.items || []).map((elem) => {
        return <option key={elem.id}>{elem.name}</option>
    });
    return <FormGroup controlId={user.id + '_playlist'} bsClass="playlists_view form-group">
        <ControlLabel> <Image src={user.pic} rounded/>{user.id}</ControlLabel>
        <ButtonGroup>
            <Button className="fa fa-refresh" onClick={() => props.onUpdate(user.id)}/>
            <Button className="fa fa-minus" onClick={() => props.onDelete(user.id)} disabled={!props.erasable}/>
        </ButtonGroup>
        <FormControl name={user.id} componentClass="select" multiple onChange={(e) => {
            let name = e.target.name;
            let sel = [];
            for (let el of e.target.selectedOptions) {
                sel.push(el.label)
            }

            console.log('elements');
            props.onSelect(name, sel);
        }}>
            {items}
        </FormControl>
    </FormGroup>
};
UserPlaylist.propTypes = {
    user: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onSelect: PropTypes.func,
    erasable: PropTypes.bool
};


export default class PlaylistCombiner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            chosen: undefined,
            indexer: [],
            isCurrentUser: true,
            userType: "this_user",
            userField: "",
            users: {},

        };
        this.getUserInformation = this.getUserInformation.bind(this);
        this.deleteUserPlaylist = this.deleteUserPlaylist.bind(this);
        this.updateSelectedPlaylist = this.updateSelectedPlaylist.bind(this);
    }

    static componentWillUnmount() {
        console.log('component PlaylistCombiner unmounted');
    }

    getUserInformation(user) {
        console.log('get ' + user);
//todo users should not be more then 4
        const that = this;
        const {sp_user} = this.context.store.getState();
        let updateUsers = function (new_user) {
            const user = that.state.users[new_user.id];
            let newUsers = {};
            newUsers[new_user.id] = Object.assign({}, user, new_user);
            return {users: Object.assign({}, that.state.users, newUsers)};
        };
        getUserAndPlaylists(sp_user.access_token, user).then(new_user => {
            that.setState(updateUsers(new_user));
            console.log('Retrieved playlists ', new_user)
        });
    }

    deleteUserPlaylist(user_id) {
        console.log('delete ' + user_id);
        const users_new = Object.assign({}, this.state.users);
        delete users_new[user_id];
        this.setState({users: users_new});

    }

    updateSelectedPlaylist(user, selected) {
        let that=this;
        let updateSelected =  (id, arr)=> {
            let newSelected = {};
            newSelected[id] = arr;
            return {selected: Object.assign({}, that.state.selected, newSelected)};
        };
        this.setState(updateSelected(user, selected));
    }

    componentDidMount() {
        console.log('component PlaylistCombiner did mount');
        const {sp_user} = this.context.store.getState();
        this.getUserInformation(sp_user.id);
    }

    render() {
        const {sp_user} = this.context.store.getState();
        const {selected, chosen, indexer, userField, users} = this.state;
        // const map_selected = Object.keys(selected).map(elem => {
        //     const playlists=selected[elem].map(el=><div key={"elem_"+el}>
        //         <strong>{elem}</strong>{el}</div>);
        //     return <div key={'sel_' + elem}>
        //         {playlists}
        //     </div>
        // });
        // const item_list = ((users[sp_user.id] || {}).items || []).map((elem) => <option
        //     key={elem.id}>{elem.name}</option>);
        const users_playlists = Object.keys(users).map((el) => {
            return <UserPlaylist user={users[el]} key={el + "_playlists"}
                                 onUpdate={this.getUserInformation} onDelete={this.deleteUserPlaylist}
                                 onSelect={this.updateSelectedPlaylist}
                                 erasable={(users[el] || {}).id !== sp_user.id}/>
        });
        return (<div>
            <h3>Combiner</h3>
            <div id="from_playlist">
                <h5>From: </h5>
                <input type="text" value={userField} placeholder="spotify user name" autoComplete="on"
                       onChange={(e) => this.setState({userField: e.target.value})} onKeyPress={(e) => {
                    if (e.which === 13) {
                        this.getUserInformation(userField)
                    }
                }}/>
                <Button type="submit" onClick={() => this.getUserInformation(userField)} className="fa fa-search"/>
                <div className="playlists_view_conteiner">
                    {users_playlists}
                </div>
                <i className="fa fa-plus" aria-hidden="true" onClick={() => {
                    // if (chosen && !indexer.contains(chosen.name)) {
                    //     this.setState({selected: [...selected, chosen]})
                    // }
                }}/>
            </div>
            <div id="destination_panel">
                <h5>To:</h5>
                {/*<span>Existing playlist</span>*/}
                {/*<select>*/}
                {/*{item_list}*/}
                {/*</select>*/}
                <span>New playlist</span>
                <input type="text"/>
            </div>
        </div>);
    }
}
PlaylistCombiner.contextTypes = {
    store: PropTypes.object
};
PlaylistCombiner.propTypes = {};