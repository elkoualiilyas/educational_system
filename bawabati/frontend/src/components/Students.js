import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function StudentCard({ student }) {
  return (
    <Card className="mb-3">
      <Link to={`/students/${student.id}`}>
        <Card.Img 
          variant="top" 
          src={student.image || "https://via.placeholder.com/150"} 
          alt="Student Image" 
        />
      </Link>
      <Card.Body>
        <Card.Title>{student.name}</Card.Title>
        <Card.Text>Email: {student.email}</Card.Text>
        <Card.Text>Enrolled Date: {student.enrolled_date || "N/A"}</Card.Text>
        <Link to={`/students/${student.id}`}>
          <Button variant="primary">View Profile</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default StudentCard;
