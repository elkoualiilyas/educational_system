import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../services/api';
import './CourseCard.css';

function CourseCard({ course }) {
    const [isEnrolled, setIsEnrolled] = useState(course.enrolled_count > 0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEnroll = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await enrollmentAPI.createEnrollment({ course: course.id });
            setIsEnrolled(true);
            course.enrolled_count += 1;
        } catch (err) {
            setError('Failed to enroll in course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnenroll = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const enrollments = await enrollmentAPI.getEnrollments();
            const enrollment = enrollments.data.find(e => e.course.id === course.id);
            if (enrollment) {
                await enrollmentAPI.deleteEnrollment(enrollment.id);
                setIsEnrolled(false);
                course.enrolled_count -= 1;
            }
        } catch (err) {
            setError('Failed to unenroll from course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format the date to a more readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate progress based on start and end date
    const calculateProgress = (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = new Date().getTime();
        
        if (now < start) return 0;
        if (now > end) return 100;
        
        return Math.round(((now - start) / (end - start)) * 100);
    };

    const progress = calculateProgress(course.start_date, course.end_date);
    
    // Determine status label and color based on progress
    const getStatusInfo = () => {
        if (progress === 0) return { label: 'Upcoming', color: '#3498db' };
        if (progress === 100) return { label: 'Completed', color: '#2ecc71' };
        return { label: 'In Progress', color: '#f39c12' };
    };
    
    const statusInfo = getStatusInfo();

    return (
        <div className="course-card">
            <div className="course-card-header">
                <span 
                    className="course-status" 
                    style={{ backgroundColor: statusInfo.color }}
                >
                    {statusInfo.label}
                </span>
                {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="course-image" />
                ) : (
                    <div className="course-image-placeholder">
                        <span>{course.title.charAt(0)}</span>
                    </div>
                )}
            </div>
            
            <div className="course-card-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                    {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description}
                </p>
                
                <div className="course-details">
                    <div className="course-detail">
                        <i className="icon-teacher"></i>
                        <span>{course.teacher_name || 'Unknown Teacher'}</span>
                    </div>
                    <div className="course-detail">
                        <i className="icon-students"></i>
                        <span>{course.students_count || 0} Students</span>
                    </div>
                    <div className="course-detail">
                        <i className="icon-calendar"></i>
                        <span>{formatDate(course.start_date)}</span>
                    </div>
                </div>
                
                <div className="course-progress-container">
                    <div className="course-progress-label">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="course-progress-bar">
                        <div 
                            className="course-progress-fill" 
                            style={{ width: `${progress}%`, backgroundColor: statusInfo.color }}
                        ></div>
                    </div>
                </div>
            </div>
            
            <div className="course-card-actions">
                <Link to={`/courses/${course.id}`} className="view-course-btn">
                    View Details
                </Link>
                {error && <div className="error-message">{error}</div>}
                <div className="action-buttons">
                    {isEnrolled ? (
                        <button
                            className="unenroll-btn"
                            onClick={handleUnenroll}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Unenroll'}
                        </button>
                    ) : (
                        <button
                            className="enroll-btn"
                            onClick={handleEnroll}
                            disabled={isLoading || course.enrolled_count >= course.capacity}
                        >
                            {isLoading ? 'Processing...' : 'Enroll'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseCard; 