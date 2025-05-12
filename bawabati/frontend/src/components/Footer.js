import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <Row>
          <Col className="text-center">
            &copy; {new Date().getFullYear()} E-Vente
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
