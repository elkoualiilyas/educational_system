import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function StudentCard({ student }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Img 
        src={student.image || "https://via.placeholder.com/300"} 
        variant="top" 
        className="rounded-circle mx-auto mt-3"
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
      <Card.Body className="text-center">
        <Card.Title as="h4">{student.name}</Card.Title>
        <Card.Text className="text-muted">{student.email}</Card.Text>
        <Card.Text>
          <strong>Status:</strong> {student.status || "Active"}
        </Card.Text>
        <Link to={`/students/${student.id}`}>
          <Button variant="primary" className="w-100">View Profile</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default StudentCard; 