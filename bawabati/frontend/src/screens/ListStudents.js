import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/students/");
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Students</h1>
      <LinkContainer to="/students/create">
        <Button variant="primary" className="mb-3">Create Student</Button>
      </LinkContainer>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Enrolled Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.enrolled_date || "N/A"}</td>
                <td>
                  <LinkContainer to={`/students/${student.id}/edit`}>
                    <Button variant="warning" size="sm" className="me-2">Edit</Button>
                  </LinkContainer>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(student.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No students found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

// Function to delete a student
async function handleDelete(studentId) {
  if (window.confirm("Are you sure you want to delete this student?")) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${studentId}/`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }
}

export default Students;
