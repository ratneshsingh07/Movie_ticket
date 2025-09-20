const express = require('express');
const {
  getShowsByCinema,
  getShowById,
  blockSeats,
  unblockSeats,
  createShow
} = require('../controllers/showController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/cinema/:cinemaId', getShowsByCinema);
router.get('/:id', getShowById);

// User routes (require authentication)
router.post('/:showId/block-seats', auth, blockSeats);
router.post('/:showId/unblock-seats', auth, unblockSeats);

// Admin routes
router.post('/', auth, admin, createShow);

module.exports = router;