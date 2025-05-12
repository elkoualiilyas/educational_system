import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Header() {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>My School App</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/students">
                <Nav.Link>Students</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/teachers">
                <Nav.Link>Teachers</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/courses">
                <Nav.Link>Courses</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
