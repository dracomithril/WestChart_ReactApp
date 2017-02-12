/**
 * Created by Gryzli on 12.02.2017.
 */
import React from 'react';
import {Navbar, NavItem, Nav} from 'react-bootstrap';
export default function Menu() {
    return (<Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#">Chart</a>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <NavItem eventKey={1} href="#chart_table">Chart table</NavItem>
            <NavItem eventKey={2} href="#list">List</NavItem>
        </Nav>
    </Navbar>)
}