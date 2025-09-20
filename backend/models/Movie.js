const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  genre: [{
    type: String,
    required: [true, 'At least one genre is required']
  }],
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot exceed 10']
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);