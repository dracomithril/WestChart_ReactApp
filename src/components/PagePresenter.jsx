/**
 * Created by Gryzli on 08.04.2017.
 */
import React from "react";
import PropTypes from "prop-types";
import ChartPresenter from "./ChartPresenter";
import {Modal} from "react-bootstrap";


export default class PagePresenter extends React.Component {
    /*istanbul ignore next*/
    componentWillUnmount() {
        console.log('component PagePresenter unmounted');
    }

    /*istanbul ignore next*/
    componentDidMount() {
        console.log('component PagePresenter did mount');
    }

    render() {
        const {store} = this.context;
        const {user, show_wait} = store.getState();
        return (<div>
            {user.isGroupAdmin &&
            <div id="groupAdmin">
                <div className="formArea">
                    <Modal show={show_wait}>
                        <Modal.Header>{"Information"}</Modal.Header>
                        <Modal.Body>{`${user.first_name} we are fetching data please wait.`}</Modal.Body>
                    </Modal>
                </div>
                <ChartPresenter/>
            </div>}
        </div>);
    }
}
PagePresenter.contextTypes = {
    store: PropTypes.object
};
PagePresenter.propTypes = {};