import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Educational System</h5>
            <p className="text-muted">
              Empowering education through technology and innovation.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted">Home</a></li>
              <li><a href="/courses" className="text-muted">Courses</a></li>
              <li><a href="/students" className="text-muted">Students</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: info@educationalsystem.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Education St, City</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} Educational System. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer; 