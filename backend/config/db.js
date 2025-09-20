
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed database if in development mode
    if (process.env.NODE_ENV === 'development') {
      await seedDatabase();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    const User = require('../models/User');
    const Cinema = require('../models/Cinema');
    const Screen = require('../models/Screen');
    const Movie = require('../models/Movie');
    const Show = require('../models/Show');

    // Check if data already exists
    const existingCinemas = await Cinema.countDocuments();
    if (existingCinemas > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@moviebooking.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create sample cinemas with screens
    const cinema1 = await Cinema.create({
      name: 'PVR Cinemas',
      location: 'Mumbai, Maharashtra'
    });

    const cinema2 = await Cinema.create({
      name: 'INOX Movies',
      location: 'Delhi, Delhi'
    });

    const cinema3 = await Cinema.create({
      name: 'Cinepolis',
      location: 'Bangalore, Karnataka'
    });

    // Create screens for each cinema
    const screens = [];
    for (const cinema of [cinema1, cinema2, cinema3]) {
      for (let i = 1; i <= 3; i++) {
        const screen = await Screen.create({
          screenNumber: i,
          cinema: cinema._id,
          totalSeats: 100,
          seatLayout: {
            rows: 10,
            columns: 10
          }
        });
        screens.push(screen);
        
        // Add screen to cinema
        await Cinema.findByIdAndUpdate(cinema._id, {
          $push: { screens: screen._id }
        });
      }
    }

    // Create sample movies
    const movies = await Movie.create([
      {
        title: 'Avengers: Endgame',
        description: 'The epic conclusion to the Infinity Saga',
        genre: ['Action', 'Adventure', 'Drama'],
        duration: 181,
        rating: 8.4,
        poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop',
        releaseDate: new Date('2019-04-26')
      },
      {
        title: 'The Dark Knight',
        description: 'Batman faces the Joker in this critically acclaimed sequel',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 152,
        rating: 9.0,
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
        releaseDate: new Date('2008-07-18')
      },
      {
        title: 'Inception',
        description: 'A thief enters dreams to plant an idea',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        duration: 148,
        rating: 8.8,
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
        releaseDate: new Date('2010-07-16')
      },
      {
        title: 'Parasite',
        description: 'A poor family schemes to become employed by a wealthy family',
        genre: ['Comedy', 'Drama', 'Thriller'],
        duration: 132,
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1489599510373-5c4110746fa1?w=300&h=450&fit=crop',
        releaseDate: new Date('2019-05-30')
      },
      {
        title: 'Interstellar',
        description: 'A space mission to save humanity',
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        duration: 169,
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop',
        releaseDate: new Date('2014-11-07')
      }
    ]);

    // Create sample shows
    const currentDate = new Date();
    const showTimes = ['10:00', '13:30', '17:00', '20:30'];
    
    for (const screen of screens) {
      for (const movie of movies.slice(0, 3)) { // 3 movies per screen
        for (let day = 0; day < 7; day++) { // Shows for next 7 days
          for (const time of showTimes) {
            const showDate = new Date(currentDate);
            showDate.setDate(currentDate.getDate() + day);
            const [hours, minutes] = time.split(':');
            showDate.setHours(hours, minutes, 0, 0);

            await Show.create({
              movie: movie._id,
              screen: screen._id,
              cinema: screen.cinema,
              showTime: showDate,
              price: Math.floor(Math.random() * 300) + 200, // Random price between 200-500
              bookedSeats: [],
              blockedSeats: []
            });
          }
        }
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};

module.exports = connectDB;