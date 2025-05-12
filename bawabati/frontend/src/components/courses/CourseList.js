import React, { useState, useEffect } from 'react';
import CourseCard from '../common/CourseCard';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="courses-empty">
        <i className="fas fa-book-open"></i>
        <h3>No courses available</h3>
        <p>There are currently no courses to display.</p>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <h2 className="course-list-title">Available Courses</h2>
      <div className="course-list-grid">
        {courses.map((course) => (
          <div className="course-grid-item" key={course.id}>
            <CourseCard
              id={course.id}
              title={course.title}
              description={course.description}
              teacherName={course.teacher_name}
              studentCount={course.student_count}
              createdAt={course.created_at}
              imageUrl={course.image_url || '/static/images/default-course.jpg'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 