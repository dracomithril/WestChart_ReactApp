/**
 * Created by Gryzli on 05.06.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import {ControlLabel, FormControl, FormGroup, Image, Button} from "react-bootstrap";
import Spotify from "spotify-web-api-node";
const spotifyApi = new Spotify();


const UserPlaylist = (props) => {
    return <FormGroup controlId={props.user + '_playlist'} bsClass="playlists_view form-group">
        <ControlLabel> <Image style={{width: 40, height: 40, padding: 5}}
                              src={props.pic}
                              rounded/>{props.user}</ControlLabel>
        <Button className="fa fa-refresh" onClick={() => props.update(props.user)}/>
        <Button className="fa fa-minus" onClick={()=>alert('not implemented')}/>
        <FormControl componentClass="select" style={{height:150}} multiple>
            {props.items}
        </FormControl>
    </FormGroup>
};
UserPlaylist.propTypes = {
    user: PropTypes.string,
    pic: PropTypes.string,
    items: PropTypes.array,
    update: PropTypes.func
};


export default class PlaylistCombiner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            chosen: undefined, indexer: [],
            isCurrentUser: true,
            userType: "this_user", userField: undefined,
            users: {}
        };
        this.getUserInformation = this.getUserInformation.bind(this);
    }

    componentWillUnmount() {
        console.log('component PlaylistCombiner unmounted');
    }

    getUserInformation(user) {
        console.log(user);

        const that = this;
        const {sp_user} = this.context.store.getState();
        spotifyApi.setAccessToken(sp_user.access_token);
        spotifyApi.getUser(user)
            .then(data => {
                const user_id = data.body.id;
                let new_user = {
                    pic: (data.body.images[0] || {}).url,
                    id: user_id
                };
                const update_user = Object.assign({}, that.state.users[user_id], new_user);
                let newUsers = {};
                newUsers[user_id] = update_user;
                const users_new = Object.assign({}, that.state.users, newUsers);
                that.setState({users: users_new});
                spotifyApi.getUserPlaylists(user_id)
                    .then(data => {
                        let new_user = Object.assign({}, that.state.users[user_id], {items: data.body.items});
                        let newUsers = {};
                        newUsers[user_id] = new_user;
                        const users_new = Object.assign({}, that.state.users, newUsers);
                        that.setState({users: users_new});
                        console.log('Retrieved playlists', data.body);
                    }, (err) => {
                        console.log('Something went wrong!', err);
                    });
                console.log('Some information about user', data.body);
            }, err => {
                console.log('Something went wrong!', err);
            });
    }

    componentDidMount() {
        console.log('component PlaylistCombiner did mount');
        const {sp_user} = this.context.store.getState();
        this.getUserInformation(sp_user.id);
    }

    render() {
        const {sp_user} = this.context.store.getState();
        const {selected, chosen, indexer, userField, users} = this.state;
        const map_selected = selected.map(elem => {
            return <div key={'sel_' + elem.id}>
                <span>{elem.name}</span>
            </div>
        });
        let map_playlist = (elem) => {
            return <option key={elem.id}>{elem.name}</option>
        };
        const item_list = ((users[sp_user.id] || {}).items || []).map(map_playlist);
        const users_playlists = Object.keys(users).map((el) => {
            const m = (users[el].items || []).map(map_playlist);
            return <UserPlaylist user={users[el].id} key={el + "_playlists"} items={m} pic={(users[el] || {}).pic}
                                 update={this.getUserInformation}/>
        });
        return (<div>
            <h3>Combiner</h3>
            <div id="from_playlist">
                <h5>From: </h5>

                <input type="text" value={userField} placeholder="spotify user"
                       onChange={(e) => this.setState({userField: e.target.value})}/>
                <Button onClick={() => this.getUserInformation(userField)} className="fa fa-search"/>
                <div className="playlists_view_conteiner">
                    {users_playlists}
                </div>
                <i className="fa fa-plus" aria-hidden="true" onClick={() => {
                    if (chosen && !indexer.contains(chosen.name)) {
                        this.setState({selected: [...selected, chosen]})
                    }
                }}/>
                {map_selected}
            </div>
            <div style={{border: '1px solid black', background: 'grey'}}>
                <h5>To:</h5>
                <span>Existing playlist</span>
                <select>
                    {item_list}
                </select>
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