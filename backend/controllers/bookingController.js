const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!seats || seats.length === 0 || seats.length > 6) {
      return res.status(400).json({
        success: false,
        message: 'Please select 1-6 seats'
      });
    }

    const show = await Show.findById(showId).populate('movie screen cinema');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Clean up expired blocked seats
    await show.cleanupBlockedSeats();

    // Check if seats are available
    const unavailableSeats = [];
    for (const seatId of seats) {
      if (show.bookedSeats.includes(seatId)) {
        unavailableSeats.push(seatId);
      }
      
      // Check if seat is blocked by another user
      const blockedByOther = show.blockedSeats.find(
        blocked => blocked.seatId === seatId && blocked.userId.toString() !== userId
      );
      if (blockedByOther) {
        unavailableSeats.push(seatId);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some seats are no longer available',
        unavailableSeats
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * show.price;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      seats,
      totalAmount
    });

    // Update show with booked seats
    show.bookedSeats.push(...seats);
    
    // Remove blocked seats for this user
    show.blockedSeats = show.blockedSeats.filter(
      blocked => blocked.userId.toString() !== userId
    );
    
    await show.save();

    // Update user's bookings
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    // Emit socket event
    if (req.io) {
      req.io.to(`show-${showId}`).emit('booking-confirmed', {
        seats,
        userId,
        showId
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: {
          path: 'movie cinema screen'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: { booking: populatedBooking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'show',
        populate: {
          path: 'movie cinema screen'
        }
      })
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, user: userId })
      .populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Check if show time has passed
    if (new Date() > booking.show.showTime) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking after show time'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Remove seats from show's booked seats
    const show = await Show.findById(booking.show._id);
    show.bookedSeats = show.bookedSeats.filter(
      seat => !booking.seats.includes(seat)
    );
    await show.save();

    // Emit socket event
    if (req.io) {
      req.io.to(`show-${booking.show._id}`).emit('booking-cancelled', {
        seats: booking.seats,
        showId: booking.show._id
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

const getShowBookings = async (req, res) => {
  try {
    const { showId } = req.params;

    const bookings = await Booking.find({ 
      show: showId, 
      status: 'confirmed' 
    })
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: {
          path: 'movie cinema screen'
        }
      });

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching show bookings',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getShowBookings
};