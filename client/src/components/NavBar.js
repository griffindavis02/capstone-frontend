import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Nav, Container } from 'react-bootstrap'
import logo from '../logo.png'

const NavBar = () => {
    return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">
                        <img src={logo} alt="logo" width="30" height="30" className="d-inline-block align-top"/>{' '}
                        BRRG
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav.Link target="_blank" href="https://github.com/griffindavis02/eth-bit-flip">GitHub</Nav.Link>
                        <Nav.Link href="/About">About</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default NavBar