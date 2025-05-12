import React from 'react';
import { Link } from 'react-router-dom';
import './UserCard.css';

function UserCard({ user }) {
  // Get the role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'teacher':
        return 'info';
      case 'student':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <img 
          src={user.profile_picture || "/static/images/default-avatar.png"} 
          alt={user.username} 
          className="user-avatar"
        />
        <div className={`role-badge ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </div>
      </div>
      <div className="user-card-body">
        <h3 className="user-name">
          {user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}` 
            : user.username}
        </h3>
        <p className="user-email">{user.email}</p>
        <p className="user-joined">
          <i className="far fa-calendar-alt"></i> 
          {new Date(user.date_joined).toLocaleDateString()}
        </p>
      </div>
      <div className="user-card-footer">
        <Link to={`/users/${user.id}`} className="btn btn-sm btn-primary">
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default UserCard; 