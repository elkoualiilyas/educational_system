import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call to fetch course details
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCourse({
          id: id,
          title: 'Introduction to Programming',
          description: 'A comprehensive introduction to programming concepts and practices. This course covers the fundamentals of computer programming, including variables, data types, control structures, functions, and basic algorithms.',
          instructor: {
            name: 'Dr. Jane Smith',
            email: 'jane.smith@example.com'
          },
          startDate: '2023-09-01',
          endDate: '2023-12-15',
          capacity: 30,
          enrolledCount: 24,
          notes: [
            { id: 1, title: 'Lecture 1: Introduction', uploadedBy: 'Dr. Jane Smith', uploadDate: '2023-09-01' },
            { id: 2, title: 'Lecture 2: Variables and Data Types', uploadedBy: 'Dr. Jane Smith', uploadDate: '2023-09-08' },
            { id: 3, title: 'Assignment 1', uploadedBy: 'Dr. Jane Smith', uploadDate: '2023-09-15' }
          ]
        });
        setError('');
      } catch (err) {
        setError('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading course details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Course Not Found</Alert.Heading>
          <p>The course you are looking for does not exist or has been removed.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{course.title}</h2>
            <Button variant="light" size="sm">Enroll</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5 className="text-muted mb-3">Description:</h5>
              <p>{course.description}</p>
              
              <h5 className="text-muted mt-4 mb-3">Instructor:</h5>
              <p>{course.instructor.name} ({course.instructor.email})</p>
            </Col>
            
            <Col md={4}>
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Course Information</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Start Date:</strong> {course.startDate}</p>
                  <p><strong>End Date:</strong> {course.endDate}</p>
                  <p>
                    <strong>Enrollment:</strong> {' '}
                    <Badge bg="info">{course.enrolledCount}/{course.capacity}</Badge>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="bg-info text-white">
          <h3 className="mb-0">Course Notes</h3>
        </Card.Header>
        <Card.Body>
          {course.notes.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {course.notes.map(note => (
                  <tr key={note.id}>
                    <td>{note.title}</td>
                    <td>{note.uploadedBy}</td>
                    <td>{note.uploadDate}</td>
                    <td>
                      <Button variant="primary" size="sm">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              No notes available for this course yet.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CourseDetail; 