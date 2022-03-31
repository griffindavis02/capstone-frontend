import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { LoginButton, LogoutButton } from './Login'
import logo from '../logo.png'

const NavBar = () => {
    const { isAuthenticated } = useAuth0()

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} alt="logo" width="30" height="30" className="d-inline-block align-top" />{' '}
                    BRRG
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className="text.dark" target="_blank" href="https://github.com/griffindavis02/eth-bit-flip">GitHub</Nav.Link>
                    </Nav>
                    <Nav>
                        {isAuthenticated
                            ? <LogoutButton />
                            : <LoginButton />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar