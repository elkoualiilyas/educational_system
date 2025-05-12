import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const { id, title, teacher_name, description, student_count, created_at, image_url } = course;
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Truncate description if too long
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="course-card">
      <div className="course-card-image">
        <img 
          src={image_url || '/static/images/course-default.jpg'} 
          alt={title} 
        />
        <div className="course-card-badge">
          <span>{student_count} Students</span>
        </div>
      </div>
      
      <div className="course-card-body">
        <h3 className="course-title">
          <Link to={`/courses/${id}`}>{title}</Link>
        </h3>
        
        <p className="course-instructor">
          <i className="fas fa-chalkboard-teacher"></i> {teacher_name || 'Unknown Teacher'}
        </p>
        
        <p className="course-description">
          {truncateText(description || 'No description available', 100)}
        </p>
        
        <div className="course-card-footer">
          <span className="course-date">
            <i className="far fa-calendar-alt"></i> {formatDate(created_at)}
          </span>
          
          <Link to={`/courses/${id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 