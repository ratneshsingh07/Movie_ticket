const express = require('express');
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Admin routes
router.post('/', auth, admin, createMovie);
router.put('/:id', auth, admin, updateMovie);
router.delete('/:id', auth, admin, deleteMovie);

module.exports = router;