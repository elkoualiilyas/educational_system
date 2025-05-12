import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/courses/CourseCard';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    teacher: '',
    minStudents: '',
    maxStudents: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch courses from Django API endpoint
      const response = await axios.get('/api/courses/');
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      setLoading(false);
      console.error('Error fetching courses:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      teacher: '',
      minStudents: '',
      maxStudents: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    // Search term filter
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Additional filters
    const matchesTeacher = filters.teacher ? course.teacher_name.toLowerCase().includes(filters.teacher.toLowerCase()) : true;
    const matchesMinStudents = filters.minStudents ? course.students_count >= parseInt(filters.minStudents) : true;
    const matchesMaxStudents = filters.maxStudents ? course.students_count <= parseInt(filters.maxStudents) : true;
    
    // Date filters
    const courseDate = new Date(course.created_at);
    const matchesDateFrom = filters.dateFrom ? courseDate >= new Date(filters.dateFrom) : true;
    const matchesDateTo = filters.dateTo ? courseDate <= new Date(filters.dateTo) : true;
    
    return matchesSearch && matchesTeacher && matchesMinStudents && 
           matchesMaxStudents && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Available Courses</h1>
        <p>Explore our wide range of courses designed to enhance your skills</p>
      </div>

      <div className="course-list-actions">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by title, description or teacher..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <button className="filter-button" onClick={toggleFilters}>
          <FaFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filter Courses</h3>
            <button className="close-filters" onClick={toggleFilters}>
              <FaTimes />
            </button>
          </div>
          
          <div className="filter-form">
            <div className="filter-group">
              <label htmlFor="teacher">Teacher</label>
              <input
                type="text"
                id="teacher"
                name="teacher"
                placeholder="Filter by teacher name"
                value={filters.teacher}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="minStudents">Min Students</label>
                <input
                  type="number"
                  id="minStudents"
                  name="minStudents"
                  placeholder="Min"
                  value={filters.minStudents}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="maxStudents">Max Students</label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  placeholder="Max"
                  value={filters.maxStudents}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="dateFrom">From Date</label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="dateTo">To Date</label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="reset-button" onClick={resetFilters}>
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCourses}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="results-count">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>

          {filteredCourses.length === 0 ? (
            <div className="no-results">
              <h3>No courses found</h3>
              <p>Try changing your search criteria or filters</p>
              <button onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="course-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-item">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList; 