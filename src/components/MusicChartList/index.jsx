/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Modal, Badge, Table, Button, Overlay, Popover, ButtonGroup, FormControl} from 'react-bootstrap';
import './style.css';
const _ = require('lodash');
export default class MusicChartList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printList: [],
            target: undefined,
            show_print_list: false,
        }
    }

    generateList(event) {
        if (!this.state.show_print_list) {
            const table = _.clone(this.props.list);
            let filtered = table.filter((elem) => {
                return elem.selected
            });
            this.setState({
                printList: filtered,
                show_print_list: true,
                target: event.target
            })
        }
        else {
            this.setState({show_print_list: false})
        }

    }

    render() {
        const sorting_options = this.props.sorting_options.map((elem, index) => <option key={index}
                                                                                        value={elem}>{elem.toLowerCase()}</option>);
        const handleListChange = this.props.onListChange;
        const things = this.props.list.map((elem, id) => {
            return <tr key={id}>
                <td><input type="checkbox" name={elem.id} checked={elem.selected} onChange={handleListChange}/></td>
                <td><Badge bsClass="likes">{elem.reactions}</Badge></td>
                <td><span>{elem.who}</span></td>
                <td><span>{elem.when.toLocaleString('pl-PL', {
                    year: "numeric",
                    month: "2-digit",
                    day: "numeric"
                })}</span></td>
                <td><span>{elem.title}</span></td>
            </tr>
        });
        let print_list = this.state.printList.map((elem, index) => {
            return (<div key={index}>
                <span>{index + 1}</span>
                {`. ${elem.title} `}
                <Badge bsClass="likes">{elem.reactions + ' likes'}</Badge>
            </div>)
        });
        return (
            <Modal show={this.props.show}
                   onHide={this.props.close}
                   container={this.props.container}
                   aria-labelledby="contained-modal-title">
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title">{"Create your perfect music list "}<Badge
                        bsClass="elements_count">{this.props.list.length}</Badge></Modal.Title>
                    <FormControl componentClass="select" placeholder="select" name="list_sort"
                                 value={this.props.sort_by} onChange={this.props.sort}>
                        {sorting_options}
                    </FormControl>
                </Modal.Header>
                <Modal.Body>

                    <Table striped bordered condensed hover responsive>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>reactions</th>
                            <th>who?</th>
                            <th>when?</th>
                            <th>what?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {things}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Overlay
                        show={this.state.show_print_list}
                        target={this.state.target}
                        placement="top"
                        container={this}
                        containerPadding={5}>
                        <Popover id="popover-contained" title="Print list">
                            {print_list}
                        </Popover>
                    </Overlay>
                    <ButtonGroup>
                        <Button bsStyle="warning" onClick={this.props.toggle}>Toggle</Button>
                        <Button onClick={this.generateList.bind(this)} bsStyle="success">Generate</Button>
                        <Button onClick={this.props.close}>Close</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>)
    }
}
MusicChartList.propTypes = {
    onListChange: React.PropTypes.func,
    close: React.PropTypes.func,
    list: React.PropTypes.array,
    show: React.PropTypes.bool,
    container: React.PropTypes.object
};