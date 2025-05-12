import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseCard from './CourseCard';
import './CourseList.css';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseAPI.getCourses();
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || 
                            (activeFilter === 'enrolled' && course.enrolled_count > 0) ||
                            (activeFilter === 'available' && course.enrolled_count < course.capacity);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="course-list-container">
            <div className="course-list-header">
                <h2>Available Courses</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="filter-buttons">
                        <button
                            className={activeFilter === 'all' ? 'active' : ''}
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={activeFilter === 'enrolled' ? 'active' : ''}
                            onClick={() => setActiveFilter('enrolled')}
                        >
                            Enrolled
                        </button>
                        <button
                            className={activeFilter === 'available' ? 'active' : ''}
                            onClick={() => setActiveFilter('available')}
                        >
                            Available
                        </button>
                    </div>
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="empty-message">
                    No courses found matching your criteria.
                </div>
            ) : (
                <div className="course-grid">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseList; 