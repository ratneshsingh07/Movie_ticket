
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Screen = require('../models/Screen');

const getShowsByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const { date } = req.query;

    let dateFilter = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      dateFilter = {
        showTime: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }

    const shows = await Show.find({
      cinema: cinemaId,
      ...dateFilter
    })
      .populate('movie')
      .populate('screen')
      .sort({ showTime: 1 });

    // Group shows by movie
    const groupedShows = shows.reduce((acc, show) => {
      const movieId = show.movie._id.toString();
      if (!acc[movieId]) {
        acc[movieId] = {
          movie: show.movie,
          shows: []
        };
      }
      acc[movieId].shows.push(show);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { 
        cinema: cinemaId,
        movieShows: Object.values(groupedShows)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shows',
      error: error.message
    });
  }
};

const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('screen')
      .populate('cinema');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Clean up expired blocked seats
    await show.cleanupBlockedSeats();

    res.json({
      success: true,
      data: { show }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching show',
      error: error.message
    });
  }
};

const blockSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const { seats } = req.body;
    const userId = req.user.id;

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Clean up expired blocked seats first
    await show.cleanupBlockedSeats();

    // Check if seats are already booked or blocked
    const unavailableSeats = [];
    for (const seatId of seats) {
      if (show.bookedSeats.includes(seatId)) {
        unavailableSeats.push(seatId);
      }
      const isBlocked = show.blockedSeats.some(
        blocked => blocked.seatId === seatId && blocked.userId.toString() !== userId
      );
      if (isBlocked) {
        unavailableSeats.push(seatId);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some seats are not available',
        unavailableSeats
      });
    }

    // Remove existing blocks by this user
    show.blockedSeats = show.blockedSeats.filter(
      blocked => blocked.userId.toString() !== userId
    );

    // Add new blocks
    const newBlocks = seats.map(seatId => ({
      seatId,
      blockedAt: new Date(),
      userId
    }));

    show.blockedSeats.push(...newBlocks);
    await show.save();

    // Emit socket event
    if (req.io) {
      req.io.to(`show-${showId}`).emit('seats-blocked', {
        seats,
        userId
      });
    }

    res.json({
      success: true,
      message: 'Seats blocked successfully',
      data: { blockedSeats: seats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blocking seats',
      error: error.message
    });
  }
};

const unblockSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const userId = req.user.id;

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Remove blocks by this user
    const unblockedSeats = show.blockedSeats
      .filter(blocked => blocked.userId.toString() === userId)
      .map(blocked => blocked.seatId);

    show.blockedSeats = show.blockedSeats.filter(
      blocked => blocked.userId.toString() !== userId
    );

    await show.save();

    // Emit socket event
    if (req.io) {
      req.io.to(`show-${showId}`).emit('seats-unblocked', {
        seats: unblockedSeats,
        userId
      });
    }

    res.json({
      success: true,
      message: 'Seats unblocked successfully',
      data: { unblockedSeats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking seats',
      error: error.message
    });
  }
};

const createShow = async (req, res) => {
  try {
    const { movieId, screenId, cinemaId, showTime, price } = req.body;

    // Validate that movie, screen, and cinema exist
    const movie = await Movie.findById(movieId);
    const screen = await Screen.findById(screenId);
    const cinema = await Cinema.findById(cinemaId);

    if (!movie || !screen || !cinema) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie, screen, or cinema ID'
      });
    }

    const show = await Show.create({
      movie: movieId,
      screen: screenId,
      cinema: cinemaId,
      showTime: new Date(showTime),
      price
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movie')
      .populate('screen')
      .populate('cinema');

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: { show: populatedShow }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating show',
      error: error.message
    });
  }
};

module.exports = {
  getShowsByCinema,
  getShowById,
  blockSeats,
  unblockSeats,
  createShow
};
