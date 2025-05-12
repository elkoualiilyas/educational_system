import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/current-user/');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // Get CSRF token
      const csrfResponse = await axios.get('/api/csrf/');
      const csrfToken = csrfResponse.data.csrfToken;
      
      // Set CSRF token in headers
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
      
      const response = await axios.post('/api/login/', { username, password });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Get CSRF token
      const csrfResponse = await axios.get('/api/csrf/');
      const csrfToken = csrfResponse.data.csrfToken;
      
      // Set CSRF token in headers
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
      
      const response = await axios.post('/api/register/', userData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/logout/');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Logout failed. Please try again.'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 