// src/utils/api.js
import axios from 'axios';

// API Base URL
const API_URL = https://movie-ticket-rxxa.onrender.com/api;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend might be down');
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Cinema API functions
export const cinemaAPI = {
  // Get all cinemas
  getAll: () => api.get('/cinemas'),
  
  // Get cinema by ID
  getById: (id) => api.get(`/cinemas/${id}`),
  
  // Create new cinema (Admin only)
  create: (cinemaData) => api.post('/cinemas', cinemaData),
  
  // Update cinema (Admin only)
  update: (id, cinemaData) => api.put(`/cinemas/${id}`, cinemaData),
  
  // Delete cinema (Admin only)
  delete: (id) => api.delete(`/cinemas/${id}`)
};

// Movie API functions
export const movieAPI = {
  // Get all movies
  getAll: () => api.get('/movies'),
  
  // Get movie by ID
  getById: (id) => api.get(`/movies/${id}`),
  
  // Create new movie (Admin only)
  create: (movieData) => api.post('/movies', movieData),
  
  // Update movie (Admin only)
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  
  // Delete movie (Admin only)
  delete: (id) => api.delete(`/movies/${id}`)
};

// Show API functions
export const showAPI = {
  // Get shows by cinema ID
  getByCinema: (cinemaId, date = null) => {
    const params = date ? { date } : {};
    return api.get(`/shows/cinema/${cinemaId}`, { params });
  },
  
  // Get show by ID
  getById: (id) => api.get(`/shows/${id}`),
  
  // Block seats temporarily
  blockSeats: (showId, seats) => api.post(`/shows/${showId}/block-seats`, { seats }),
  
  // Unblock seats
  unblockSeats: (showId) => api.post(`/shows/${showId}/unblock-seats`),
  
  // Create new show (Admin only)
  create: (showData) => api.post('/shows', showData),
  
  // Update show (Admin only)
  update: (id, showData) => api.put(`/shows/${id}`, showData),
  
  // Delete show (Admin only)
  delete: (id) => api.delete(`/shows/${id}`)
};

// Booking API functions
export const bookingAPI = {
  // Create new booking
  create: (bookingData) => api.post('/bookings', bookingData),
  
  // Get user's bookings
  getUserBookings: () => api.get('/bookings/user'),
  
  // Cancel booking
  cancel: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  
  // Get all bookings for a show (Admin only)
  getShowBookings: (showId) => api.get(`/bookings/admin/show/${showId}`),
  
  // Get booking by ID
  getById: (bookingId) => api.get(`/bookings/${bookingId}`)
};

// Screen API functions (if needed)
export const screenAPI = {
  // Get screens by cinema
  getByCinema: (cinemaId) => api.get(`/screens/cinema/${cinemaId}`),
  
  // Get screen by ID
  getById: (id) => api.get(`/screens/${id}`)
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

// Admin Dashboard API functions
export const adminAPI = {
  // Get dashboard stats
  getStats: () => api.get('/admin/stats'),
  
  // Get recent activities
  getActivities: () => api.get('/admin/activities'),
  
  // Get system status
  getSystemStatus: () => api.get('/admin/system-status')
};

// User management API (Admin only)
export const userAPI = {
  // Get all users (Admin only)
  getAll: () => api.get('/admin/users'),
  
  // Get user by ID (Admin only)
  getById: (id) => api.get(`/admin/users/${id}`),
  
  // Update user (Admin only)
  update: (id, userData) => api.put(`/admin/users/${id}`, userData),
  
  // Delete user (Admin only)
  delete: (id) => api.delete(`/admin/users/${id}`)
};

// Utility functions for API calls
export const apiUtils = {
  // Generic GET request
  get: (endpoint) => api.get(endpoint),
  
  // Generic POST request
  post: (endpoint, data) => api.post(endpoint, data),
  
  // Generic PUT request
  put: (endpoint, data) => api.put(endpoint, data),
  
  // Generic DELETE request
  delete: (endpoint) => api.delete(endpoint),
  
  // Upload file
  uploadFile: (endpoint, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Download file
  downloadFile: (endpoint, filename) => {
    return api.get(endpoint, { 
      responseType: 'blob' 
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Forbidden - insufficient permissions';
      case 404:
        return 'Resource not found';
      case 409:
        return data.message || 'Conflict - resource already exists';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Internal server error';
      default:
        return data.message || `Error ${status}`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Success message handler
export const handleApiSuccess = (response) => {
  return response.data?.message || 'Operation completed successfully';
};

// Request retry utility
export const retryRequest = async (requestFunction, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFunction();
    } catch (error) {
      lastError = error;
      
      // Don't retry for client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Cache utility for API responses
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
  }
  
  set(key, value, customTTL = null) {
    const expiry = Date.now() + (customTTL || this.ttl);
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

// Cached API request wrapper
export const cachedRequest = async (key, requestFunction, cacheTTL = null) => {
  // Check cache first
  const cached = apiCache.get(key);
  if (cached) {
    return cached;
  }
  
  // Make request and cache result
  try {
    const response = await requestFunction();
    apiCache.set(key, response, cacheTTL);
    return response;
  } catch (error) {
    throw error;
  }
};

// Export the main api instance for custom use
export default api;
