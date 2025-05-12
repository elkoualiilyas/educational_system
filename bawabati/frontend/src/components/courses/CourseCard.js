import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ id, title, description, teacherName, studentCount, createdAt, imageUrl }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate description to a certain length
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="course-card">
      <div className="course-card-image">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200?text=Course+Image'} 
          alt={title} 
        />
        <div className="course-card-stats">
          <span><i className="fas fa-user-graduate"></i> {studentCount || 0}</span>
        </div>
      </div>
      <div className="course-card-content">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-description">{truncateText(description)}</p>
        <div className="course-card-footer">
          <div className="course-card-teacher">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>{teacherName || 'Unknown Teacher'}</span>
          </div>
          <div className="course-card-date">
            <i className="far fa-calendar-alt"></i>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        <Link to={`/courses/${id}`} className="course-card-link">
          View Course <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 