import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../components/common/StatCard';
import UserCard from '../components/common/UserCard';
import CourseCard from '../components/courses/CourseCard';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    teachers: 0,
    notes: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user data
        const userResponse = await axios.get('/api/current-user/');
        setUserData(userResponse.data);
        
        // Fetch dashboard statistics
        const statsResponse = await axios.get('/api/dashboard-stats/');
        setStats(statsResponse.data);
        
        // Fetch recent courses
        const coursesResponse = await axios.get('/api/courses/?limit=4');
        setRecentCourses(coursesResponse.data);
        
        // For admin users, fetch recent users as well
        if (userResponse.data.role === 'admin') {
          const usersResponse = await axios.get('/api/users/?limit=4');
          setRecentUsers(usersResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon"></div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  if (!userData) {
    return (
      <div className="dashboard-error">
        <p>Please log in to view your dashboard.</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  if (userData.role === 'admin') {
    return <AdminDashboard stats={stats} recentCourses={recentCourses} recentUsers={recentUsers} />;
  } else if (userData.role === 'teacher') {
    return <TeacherDashboard stats={stats} recentCourses={recentCourses} userData={userData} />;
  } else {
    return <StudentDashboard stats={stats} recentCourses={recentCourses} userData={userData} />;
  }
};

const AdminDashboard = ({ stats, recentCourses, recentUsers }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the administration dashboard</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Courses" 
          value={stats.courses} 
          icon="fas fa-graduation-cap" 
          color="primary" 
          linkTo="/courses"
        />
        <StatCard 
          title="Total Students" 
          value={stats.students} 
          icon="fas fa-user-graduate" 
          color="success" 
          linkTo="/users?role=student"
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.teachers} 
          icon="fas fa-chalkboard-teacher" 
          color="info" 
          linkTo="/users?role=teacher"
        />
        <StatCard 
          title="Total Notes" 
          value={stats.notes} 
          icon="fas fa-file-alt" 
          color="warning" 
          linkTo="/notes"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Courses</h2>
            <Link to="/courses" className="view-all">View All</Link>
          </div>
          <div className="course-grid">
            {recentCourses.length > 0 ? (
              recentCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p className="empty-message">No courses available</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>New Users</h2>
            <Link to="/users" className="view-all">View All</Link>
          </div>
          <div className="user-grid">
            {recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="empty-message">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = ({ stats, recentCourses, userData }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {userData.first_name}!</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Your Courses" 
          value={stats.teacherCourses || 0} 
          icon="fas fa-book" 
          color="primary" 
          linkTo="/courses"
        />
        <StatCard 
          title="Your Students" 
          value={stats.teacherStudents || 0} 
          icon="fas fa-user-graduate" 
          color="success"
        />
        <StatCard 
          title="Course Notes" 
          value={stats.teacherNotes || 0} 
          icon="fas fa-file-alt" 
          color="info" 
          linkTo="/notes"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section wide">
          <div className="section-header">
            <h2>Your Courses</h2>
            <Link to="/courses" className="view-all">View All</Link>
          </div>
          <div className="course-grid">
            {recentCourses.length > 0 ? (
              recentCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="empty-courses">
                <p>You are not assigned to any courses yet.</p>
                <p className="small-text">The administrator will assign courses to you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ stats, recentCourses, userData }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, {userData.first_name}!</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Enrolled Courses" 
          value={stats.enrolledCourses || 0} 
          icon="fas fa-book" 
          color="primary" 
          linkTo="/courses"
        />
        <StatCard 
          title="Available Courses" 
          value={stats.courses || 0} 
          icon="fas fa-graduation-cap" 
          color="success" 
          linkTo="/courses"
        />
        <StatCard 
          title="Course Notes" 
          value={stats.studentNotes || 0} 
          icon="fas fa-file-alt" 
          color="info"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section wide">
          <div className="section-header">
            <h2>Recommended Courses</h2>
            <Link to="/courses" className="view-all">View All</Link>
          </div>
          <div className="course-grid">
            {recentCourses.length > 0 ? (
              recentCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="empty-courses">
                <p>No courses available at the moment.</p>
                <p className="small-text">Check back later for new courses.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 