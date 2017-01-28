/**
 * Created by Gryzli on 28.01.2017.
 */
import React from 'react';
import {Modal, Badge, Table, Button} from 'react-bootstrap';
export default class MusicChartList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

    }

    render() {
        const handleListChange = this.props.onListChange;
        const things = this.props.list.map((elem, id) => {
            return <tr key={id}>
                <td><input type="checkbox" name={elem.id} checked={elem.selected} onChange={handleListChange}/></td>
                <td><Badge bsClass="likes">{elem.likes}</Badge></td>
                <td><span>{elem.who}</span></td>
                <td><span>{elem.title}</span></td>
            </tr>
        });
        return (
            <Modal show={this.props.show}
                   onHide={this.props.close}
                   container={this.props.container}
                   aria-labelledby="contained-modal-title">
                <Modal.Header closeButton>
                    <Modal.Title
                        id="contained-modal-title">{"Create your perfect music list "}<Badge>{this.props.list.length}</Badge></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered condensed hover responsive>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>likes</th>
                            <th>who</th>
                            <th>what?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {things}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>)
    }
}
MusicChartList.propTypes = {};