const express = require('express');
const {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
} = require('../controllers/cinemaController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', getCinemas);
router.get('/:id', getCinemaById);

// Admin routes
router.post('/', auth, admin, createCinema);
router.put('/:id', auth, admin, updateCinema);
router.delete('/:id', auth, admin, deleteCinema);

module.exports = router;
