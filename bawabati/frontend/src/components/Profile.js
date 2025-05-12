import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

function Profile() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Student at University',
    phoneNumber: '123-456-7890',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile update submitted:', formData);
      setSuccess(true);
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={4} md={5}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Profile Picture</h4>
            </Card.Header>
            <Card.Body className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h5>John Doe</h5>
              <p className="text-muted">Student</p>
              <div className="d-grid">
                <Button variant="outline-primary" size="sm">
                  Change Picture
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Edit Profile</h4>
            </Card.Header>
            <Card.Body>
              {success && <Alert variant="success">Profile updated successfully!</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile; 