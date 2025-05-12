import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, ListGroup, Image, Col, Row, Button, Spinner, Alert } from "react-bootstrap";

function StudentProfileScreen() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/students/${id}/`);
        setStudent(data);
      } catch (error) {
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading student details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!student) {
    return (
      <Alert variant="warning" className="mt-4">
        <Alert.Heading>Not Found</Alert.Heading>
        <p>No student found with this ID.</p>
      </Alert>
    );
  }

  return (
    <div className="py-4">
      <h1 className="mb-4">Student Profile</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <Image 
                src={student.image || "https://via.placeholder.com/300"} 
                alt="Student" 
                fluid 
                roundedCircle
                className="mb-3"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
              <h3>{student.name}</h3>
              <p className="text-muted">{student.email}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Student Information</h4>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col md={4}><strong>Status:</strong></Col>
                  <Col md={8}>{student.status || "Active"}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4}><strong>Price:</strong></Col>
                  <Col md={8}>{student.price ? `${student.price} MAD` : "N/A"}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4}><strong>Enrollment Date:</strong></Col>
                  <Col md={8}>{student.enrollment_date || "N/A"}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4}><strong>Last Updated:</strong></Col>
                  <Col md={8}>{student.updated_at || "N/A"}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            <Card.Footer>
              <Link to="/students">
                <Button variant="secondary">Back to Students</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default StudentProfileScreen; 