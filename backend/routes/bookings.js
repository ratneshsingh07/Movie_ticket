const express = require('express');
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getShowBookings
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// User routes (require authentication)
router.post('/', auth, createBooking);
router.get('/user', auth, getUserBookings);
router.put('/:id/cancel', auth, cancelBooking);

// Admin routes
router.get('/admin/show/:showId', auth, admin, getShowBookings);

module.exports = router;