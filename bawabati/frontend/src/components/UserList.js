import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './common/UserCard';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') {
      return matchesSearch;
    }
    
    return user.role === activeFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="user-list-container loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container error">
        <div className="error-message">
          <div className="icon-error"></div>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-list-container empty">
        <div className="empty-message">
          <div className="icon-users"></div>
          <h3>No users found</h3>
          <p>There are no users registered in the system yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Users</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="user-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'admin' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('admin')}
          >
            Admins
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'teacher' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('teacher')}
          >
            Teachers
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'student' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('student')}
          >
            Students
          </button>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-grid-item">
              <UserCard 
                id={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                avatar={user.avatar}
                joinDate={user.joinDate}
                isActive={user.isActive}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="filtered-empty-message">
          <p>No users match your current filters.</p>
          <button onClick={() => {setActiveFilter('all'); setSearchTerm('')}}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList; 