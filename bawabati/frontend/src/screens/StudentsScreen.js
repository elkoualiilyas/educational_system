import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import StudentCard from "../components/StudentCard";

function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const { data } = await axios.get("http://localhost:8000/api/students/");
        setStudents(data);
      } catch (error) {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h1>Students</h1>
      <Row>
        {students.map(student => (
          <Col key={student.id} sm={12} md={6} lg={4}>
            <StudentCard student={student} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default StudentsScreen;
