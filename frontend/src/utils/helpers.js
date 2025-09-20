// src/utils/helpers.js

/**
 * Generate seat layout for frontend display
 */
export const generateSeatLayout = (rows = 10, columns = 10) => {
  const seats = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 1; col <= columns; col++) {
      seats.push({
        id: `${rowLabels[row]}${col}`,
        row: rowLabels[row],
        number: col,
        rowIndex: row,
        colIndex: col - 1
      });
    }
  }
  
  return seats;
};

/**
 * Get seat status for UI display
 */
export const getSeatStatus = (seatId, bookedSeats, blockedSeats, selectedSeats, currentUserId) => {
  if (bookedSeats.includes(seatId)) {
    return 'booked';
  }
  
  if (selectedSeats.includes(seatId)) {
    return 'selected';
  }
  
  const blockedSeat = blockedSeats.find(blocked => blocked.seatId === seatId);
  if (blockedSeat) {
    return blockedSeat.userId === currentUserId ? 'selected' : 'blocked';
  }
  
  return 'available';
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Format date only
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate date range for show selection
 */
export const getNextSevenDays = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      isToday: i === 0
    });
  }
  
  return dates;
};

/**
 * Check if booking can be cancelled
 */
export const canCancelBooking = (booking) => {
  if (booking.status !== 'confirmed') return false;
  
  const showTime = new Date(booking.show.showTime);
  const now = new Date();
  const timeDiff = showTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  
  return hoursDiff > 2; // Can cancel if more than 2 hours before show
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

/**
 * Error message helpers
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Format movie genre for display
 */
export const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return 'Unknown';
  return genres.join(', ');
};