const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cinema name is required'],
    trim: true,
    maxlength: [100, 'Cinema name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  screens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cinema', cinemaSchema);