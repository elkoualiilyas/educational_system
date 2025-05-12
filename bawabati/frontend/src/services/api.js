import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add a request interceptor to include the CSRF token
api.interceptors.request.use((config) => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export const userAPI = {
    getUsers: () => api.get('/users/'),
    getUser: (id) => api.get(`/users/${id}/`),
    updateUser: (id, data) => api.put(`/users/${id}/`, data),
    deleteUser: (id) => api.delete(`/users/${id}/`),
};

export const courseAPI = {
    getCourses: () => api.get('/courses/'),
    getCourse: (id) => api.get(`/courses/${id}/`),
    createCourse: (data) => api.post('/courses/', data),
    updateCourse: (id, data) => api.put(`/courses/${id}/`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}/`),
};

export const enrollmentAPI = {
    getEnrollments: () => api.get('/enrollments/'),
    getEnrollment: (id) => api.get(`/enrollments/${id}/`),
    createEnrollment: (data) => api.post('/enrollments/', data),
    updateEnrollment: (id, data) => api.put(`/enrollments/${id}/`, data),
    deleteEnrollment: (id) => api.delete(`/enrollments/${id}/`),
}; 