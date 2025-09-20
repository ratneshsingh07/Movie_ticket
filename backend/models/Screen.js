const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: [true, 'Screen number is required'],
    min: [1, 'Screen number must be at least 1']
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: [true, 'Cinema is required']
  },
  totalSeats: {
    type: Number,
    default: 100,
    min: [1, 'Total seats must be at least 1']
  },
  seatLayout: {
    rows: {
      type: Number,
      default: 10,
      min: [1, 'Rows must be at least 1']
    },
    columns: {
      type: Number,
      default: 10,
      min: [1, 'Columns must be at least 1']
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure unique screen numbers per cinema
screenSchema.index({ cinema: 1, screenNumber: 1 }, { unique: true });

module.exports = mongoose.model('Screen', screenSchema);