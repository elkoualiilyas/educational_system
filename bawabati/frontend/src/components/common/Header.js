import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Educational System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                <Nav.Link as={Link} to="/students">Students</Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/users">Users</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button 
                  variant="outline-light" 
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header; 