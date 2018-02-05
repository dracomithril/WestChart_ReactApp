/**
 * Created by Gryzli on 25.06.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const action_types = require('./../reducers/action_types');
export default class ErrorConsole extends React.Component {
  componentWillUnmount() {
    console.log('component ErrorConsole unmounted');
    this.unsubscribe();
  }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());

    console.log('component ErrorConsole did mount');
  }

  render() {
    const { store } = this.context;
    const { errors } = store.getState();
    const error_logs = errors.map((el, id) => <div
      key={'error_' + id}>{(el || {}).message || "no message look to console logs"}</div>);
    return error_logs.length > 0 && <div className="console-log">
      <h3>Errors!!!
        <button className="fa fa-trash-o"
                onClick={() => store.dispatch({ type: action_types.CLEAR_ERRORS })}>clear
        </button>
      </h3>
      {error_logs}
    </div>;
  }
}
ErrorConsole.contextTypes = {
  store: PropTypes.object
};
ErrorConsole.propTypes = {};