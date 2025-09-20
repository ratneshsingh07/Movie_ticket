
const Cinema = require('../models/Cinema');
const Screen = require('../models/Screen');

const getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find()
      .populate('screens')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { cinemas }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cinemas',
      error: error.message
    });
  }
};

const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id)
      .populate('screens');

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    res.json({
      success: true,
      data: { cinema }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cinema',
      error: error.message
    });
  }
};

const createCinema = async (req, res) => {
  try {
    const { name, location, screenCount = 3 } = req.body;

    const cinema = await Cinema.create({
      name,
      location
    });

    // Create screens for the cinema
    const screens = [];
    for (let i = 1; i <= screenCount; i++) {
      const screen = await Screen.create({
        screenNumber: i,
        cinema: cinema._id
      });
      screens.push(screen._id);
    }

    // Update cinema with screen references
    cinema.screens = screens;
    await cinema.save();

    const populatedCinema = await Cinema.findById(cinema._id).populate('screens');

    res.status(201).json({
      success: true,
      message: 'Cinema created successfully',
      data: { cinema: populatedCinema }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating cinema',
      error: error.message
    });
  }
};

const updateCinema = async (req, res) => {
  try {
    const { name, location } = req.body;

    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true, runValidators: true }
    ).populate('screens');

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    res.json({
      success: true,
      message: 'Cinema updated successfully',
      data: { cinema }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cinema',
      error: error.message
    });
  }
};

const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    // Delete associated screens
    await Screen.deleteMany({ cinema: cinema._id });

    // Delete cinema
    await Cinema.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Cinema deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cinema',
      error: error.message
    });
  }
};

module.exports = {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
};
