import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './common/Header';
import Footer from './common/Footer';
import Dashboard from '../pages/Dashboard';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './Profile';
import CourseList from './courses/CourseList';
import CourseDetail from './courses/CourseDetail';
import StudentsScreen from '../screens/StudentsScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';
import UserList from './UserList';
import { useAuth } from '../hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 py-4">
        <Container>
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/courses" element={user ? <CourseList /> : <Navigate to="/login" />} />
            <Route path="/courses/:id" element={user ? <CourseDetail /> : <Navigate to="/login" />} />
            <Route path="/students" element={user ? <StudentsScreen /> : <Navigate to="/login" />} />
            <Route path="/students/:id" element={user ? <StudentProfileScreen /> : <Navigate to="/login" />} />
            <Route path="/users" element={user && user.role === 'admin' ? <UserList /> : <Navigate to="/" />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App; 