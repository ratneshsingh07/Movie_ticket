const mongoose = require('mongoose');

const blockedSeatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true
  },
  blockedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'Screen is required']
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: [true, 'Cinema is required']
  },
  showTime: {
    type: Date,
    required: [true, 'Show time is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  bookedSeats: [{
    type: String // Seat IDs like "A1", "B5", etc.
  }],
  blockedSeats: [blockedSeatSchema]
}, {
  timestamps: true
});

// Index for efficient queries
showSchema.index({ cinema: 1, showTime: 1 });
showSchema.index({ movie: 1, showTime: 1 });

// Method to clean up expired blocked seats
showSchema.methods.cleanupBlockedSeats = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  this.blockedSeats = this.blockedSeats.filter(
    blockedSeat => blockedSeat.blockedAt > fiveMinutesAgo
  );
  return this.save();
};

module.exports = mongoose.model('Show', showSchema);