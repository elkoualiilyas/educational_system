import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/static/images/logo.png" alt="Bawabati" className="logo-image" />
          <span className="logo-text">Bawabati</span>
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-home"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/courses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-book"></i> Courses
                </Link>
              </li>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/users" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <i className="fas fa-users"></i> Users
                  </Link>
                </li>
              )}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle">
                  <img 
                    src={user.profile_picture || "/static/images/default-avatar.png"} 
                    alt={user.username} 
                    className="avatar"
                  />
                  <span>{user.username}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                    <i className="fas fa-user-circle"></i> Profile
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  <i className="fas fa-user-plus"></i> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 