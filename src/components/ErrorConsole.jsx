/**
 * Created by Gryzli on 25.06.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const action_types = require('./../reducers/action_types');

const ConsoleLog = ({ error}) => (
  <div>
    {(error || {}).message || "no message log to console logs"}
  </div>
);
ConsoleLog.propTypes = {
  error: PropTypes.object,
};

export default class ErrorConsole extends React.Component {
  componentWillUnmount() {
    console.log('component ErrorConsole unmounted');
    this.unsubscribe();
  }

  onClearClick = () => {
    const { store } = this.context;
    return () => store.dispatch({ type: action_types.CLEAR_ERRORS });
  };

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
    console.log('component ErrorConsole did mount');
  }

  render() {
    const { store } = this.context;
    const { errors } = store.getState() ;
    const error_logs = errors.map((error, id) => (<ConsoleLog error={error} key={`error_${id}`}/>));
    return error_logs.length > 0 && <div className="console-log">
      <h3>Errors!!!
        <button className="fa fa-trash-o"
                onClick={this.onClearClick}>clear
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