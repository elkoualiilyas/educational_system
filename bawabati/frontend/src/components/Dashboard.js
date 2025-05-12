import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

// Components
import StatCard from './common/StatCard';
import CourseCard from './courses/CourseCard';
import UserCard from './common/UserCard';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    enrolledCourses: 0,
    notes: 0,
    users: {
      total: 0,
      admins: 0,
      teachers: 0,
      students: 0
    }
  });
  const [courses, setCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardResponse = await axios.get('/api/dashboard-data/');
        setStats(dashboardResponse.data.stats);
        setCourses(dashboardResponse.data.courses);
        setRecentUsers(dashboardResponse.data.recentUsers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  // Render different dashboards based on user role
  if (user.role === 'admin') {
    return <AdminDashboard stats={stats} courses={courses} recentUsers={recentUsers} />;
  } else if (user.role === 'teacher') {
    return <TeacherDashboard stats={stats} courses={courses} />;
  } else {
    return <StudentDashboard stats={stats} courses={courses} />;
  }
}

function AdminDashboard({ stats, courses, recentUsers }) {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <div className="stats-container">
        <StatCard 
          title="Total Courses" 
          value={stats.courses} 
          icon="fas fa-book" 
          color="primary"
          linkTo="/courses"
        />
        <StatCard 
          title="Total Students" 
          value={stats.users.students} 
          icon="fas fa-user-graduate" 
          color="success"
          linkTo="/users?role=student"
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.users.teachers} 
          icon="fas fa-chalkboard-teacher" 
          color="info"
          linkTo="/users?role=teacher"
        />
        <StatCard 
          title="Total Notes" 
          value={stats.notes} 
          icon="fas fa-sticky-note" 
          color="warning"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Courses</h2>
          <Link to="/courses" className="see-all-link">See All <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="courses-grid">
          {courses.slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recently Joined Users</h2>
          <Link to="/users" className="see-all-link">See All <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="users-grid">
          {recentUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ stats, courses }) {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Teacher Dashboard</h1>
      
      <div className="stats-container">
        <StatCard 
          title="Your Courses" 
          value={stats.courses} 
          icon="fas fa-book" 
          color="primary"
          linkTo="/courses"
        />
        <StatCard 
          title="Total Students" 
          value={stats.users.students} 
          icon="fas fa-user-graduate" 
          color="success"
        />
        <StatCard 
          title="Total Notes" 
          value={stats.notes} 
          icon="fas fa-sticky-note" 
          color="warning"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Courses</h2>
          <Link to="/courses" className="see-all-link">See All <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="courses-grid">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ stats, courses }) {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      
      <div className="stats-container">
        <StatCard 
          title="Enrolled Courses" 
          value={stats.enrolledCourses} 
          icon="fas fa-book" 
          color="primary"
          linkTo="/courses"
        />
        <StatCard 
          title="Available Courses" 
          value={stats.courses} 
          icon="fas fa-graduation-cap" 
          color="info"
          linkTo="/courses"
        />
        <StatCard 
          title="Course Notes" 
          value={stats.notes} 
          icon="fas fa-sticky-note" 
          color="warning"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recommended Courses</h2>
          <Link to="/courses" className="see-all-link">See All <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="courses-grid">
          {courses.slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 