import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
              alt="Todo App Logo"
            />
            Todo App
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <span className="nav-link">Welcome, {user.username}!</span>
                <Button variant="outline-primary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link>Login</Nav.Link>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link>Register</Nav.Link>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
