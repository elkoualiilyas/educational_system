import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
  // Default avatar based on role
  const getDefaultAvatar = (role) => {
    switch(role) {
      case 'admin':
        return '/static/images/admin-avatar.png';
      case 'teacher':
        return '/static/images/teacher-avatar.png';
      case 'student':
        return '/static/images/student-avatar.png';
      default:
        return '/static/images/user-avatar.png';
    }
  };

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'badge-admin';
      case 'teacher':
        return 'badge-teacher';
      case 'student':
        return 'badge-student';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          <img 
            src={user.profile?.avatar || getDefaultAvatar(user.profile?.role)} 
            alt={`${user.first_name} ${user.last_name}`} 
          />
        </div>
        <div className="user-info">
          <h3>{`${user.first_name} ${user.last_name}`}</h3>
          <span className={`role-badge ${getRoleBadgeClass(user.profile?.role)}`}>
            {user.profile?.role || 'User'}
          </span>
        </div>
      </div>
      
      <div className="user-card-content">
        <div className="user-detail">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{user.email || 'N/A'}</span>
        </div>
        
        {user.profile?.phone_number && (
          <div className="user-detail">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.profile.phone_number}</span>
          </div>
        )}
        
        <div className="user-detail">
          <span className="detail-label">Joined:</span>
          <span className="detail-value">{formatDate(user.date_joined)}</span>
        </div>
        
        {user.profile?.role === 'student' && user.profile?.grade && (
          <div className="user-detail">
            <span className="detail-label">Grade:</span>
            <span className="detail-value">{user.profile.grade}</span>
          </div>
        )}
        
        {user.profile?.role === 'teacher' && user.profile?.subject && (
          <div className="user-detail">
            <span className="detail-label">Subject:</span>
            <span className="detail-value">{user.profile.subject}</span>
          </div>
        )}
      </div>
      
      <div className="user-card-footer">
        <button 
          className="view-profile-btn"
          onClick={() => window.location.href = `/profile/${user.id}`}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard; 