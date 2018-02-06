/**
 * Created by Gryzli on 09.04.2017.
 */
import React from "react";
import PropTypes from 'prop-types';
import {Badge, Button} from "react-bootstrap";
import './components.css';
import copy from 'clipboard-copy';
// let {sorting} = require('./../utils');
const create_print_list = (elem, index) => {
  return <div key={elem.id}>
    <span>{index + 1}</span>
    {`. ${elem.link.title} `}
    <Badge bsClass="likes">{elem.reactions_num + ' likes'}</Badge>
  </div>
};
// const create_print_list_txt = (elem, index) => {
//     return `${index + 1}. ${elem.link.title} ${elem.reactions_num} likes`
// };
export default class Summary extends React.Component {
  /*istanbul ignore next*/
  componentWillUnmount() {
    console.log('component Summary unmounted');
  }

  /*istanbul ignore next*/
  componentDidMount() {
    console.log('component Summary did mount');
  }

  state = {
    introText: "",
    riddleText: "",
    riddleUrl: ""
  };

  onCopyToClipboard = () => {
    const { store } = this.context;
    const { sp_playlist_info } = store.getState();
    let playList = this.props.selected.map((elem, ind) => `${ind + 1}. ${elem.link.title} ${elem.reactions_num} likes`).join("\n");
    let text = `[WCS Weekly Westletter]

${this.state.introText}

${playList}

${sp_playlist_info.url ? "Link to spotify playlist:" + sp_playlist_info.url : "No link"}

Roddle:
${this.state.riddleText}

${this.state.riddleUrl}`;
    copy(text);
    alert("Summary was copied to clipboard")
  }

  render() {
    const { store } = this.context;
    const { sp_playlist_info } = store.getState();
    let print_list = this.props.selected.map(create_print_list);
    return (<div className="summary">
      <h3 id="summary">Summary
        <Button bsStyle="info" onClick={this.onCopyToClipboard}>
          <i className="fa fa-clipboard"/>
        </Button>
        <Button onClick={() => {
          alert("Not implemented jet.")
        }} disabled>Publish2<i className="fa fa-facebook-official"/>
        </Button>
      </h3>
      <h6>[WCS Weekly Westletter]</h6>
      <textarea id="textarea_add" className="write_your_mind" placeholder={"Here write what you want"}
                value={this.state.introText} onChange={(e) => {
        this.setState({ introText: e.target.value })
      }}/>
      {print_list.length === 0 && <div>
        <span style={{ color: "red" }}>Here will be list of tracks your choosing</span>
      </div>}
      < div id="popover-contained" title="Print list">
        {print_list}
      </div>

      {/*<textarea id="popover-contained" title="Print list" className="write_your_mind " placeholder={"Print list"} value={print_list.join('\n')}/>*/}
      <h6>{"Link to spotify playlist: "}
        {sp_playlist_info.url && <a href={sp_playlist_info.url} target="_newtab">{sp_playlist_info.url}</a>}
        {!sp_playlist_info.url && <span style={{ color: "red" }}>No link</span>}
      </h6>
      <textarea id="riddler" className="write_your_mind" placeholder={"riddle that you have in mind"}
                value={this.state.riddleText} onChange={(e) => {
        this.setState({ riddleText: e.target.value })
      }}/><br/>
      <label target="link2riddle">Link for Riddle</label>
      <input type="text" id="link2riddle" placeholder={" link to riddle"} value={this.state.riddleUrl}
             onChange={(e) => {
               this.setState({ riddleUrl: e.target.value })
             }}/>
    </div>);
  }
}
Summary.contextTypes = {
  store: PropTypes.object
};
Summary.propTypes = {};