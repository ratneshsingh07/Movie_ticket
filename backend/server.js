// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const http = require('http');
// const socketIo = require('socket.io');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);

// Initialize Socket.io
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     // Seed database if in development mode
//     if (process.env.NODE_ENV === 'development') {
//       await seedDatabase();
//     }
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };

// const seedDatabase = async () => {
//   try {
//     const User = require('./models/User');
    
//     // Check if admin already exists
//     const existingAdmin = await User.findOne({ email: 'admin@moviebooking.com' });
//     if (existingAdmin) {
//       console.log('Admin user already exists');
//       return;
//     }

//     console.log('Creating admin user...');
    
//     // Create admin user
//     const admin = await User.create({
//       name: 'Admin User',
//       email: 'admin@moviebooking.com',
//       password: 'admin123',
//       role: 'admin'
//     });

//     console.log('Admin user created successfully');
//     console.log('Email: admin@moviebooking.com');
//     console.log('Password: admin123');
    
//   } catch (error) {
//     console.error('Database seeding error:', error);
//   }
// };

// // Connect to database
// connectDB();

// // Middleware
// app.use(helmet());
// app.use(morgan('combined'));
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Socket.io middleware
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Import routes
// const authRoutes = require('./routes/auth');
// const cinemaRoutes = require('./routes/cinemas');
// const movieRoutes = require('./routes/movies');
// const showRoutes = require('./routes/shows');
// const bookingRoutes = require('./routes/bookings');

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/cinemas', cinemaRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/shows', showRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Movie Booking API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // Test endpoint for debugging
// app.get('/api/test', (req, res) => {
//   res.json({
//     message: 'Backend is working!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Handle Socket.io connections
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
  
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
  
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error'
//   });
// });

// // Handle unhandled routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV}`);
//   console.log(`Health check: http://localhost:${PORT}/api/health`);
// });


// server.js - Fixed version with proper Socket.io setup
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const cinemaRoutes = require('./routes/cinemas');
const movieRoutes = require('./routes/movies');
const showRoutes = require('./routes/shows');
const bookingRoutes = require('./routes/bookings');

// Import database connection
const connectDB = require('./config/db');

const app = express();

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.io middleware to make it available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Movie Booking API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a show room for real-time seat updates
  socket.on('join-show', (showId) => {
    socket.join(`show-${showId}`);
    console.log(`User ${socket.id} joined show ${showId}`);
  });

  // Handle seat selection
  socket.on('seat-selected', (data) => {
    console.log(`Seat selected: ${data.seatId} by user ${data.userId}`);
    socket.to(`show-${data.showId}`).emit('seat-blocked', {
      seatId: data.seatId,
      userId: data.userId
    });
  });

  // Handle seat deselection
  socket.on('seat-deselected', (data) => {
    console.log(`Seat deselected: ${data.seatId} by user ${data.userId}`);
    socket.to(`show-${data.showId}`).emit('seat-unblocked', {
      seatId: data.seatId,
      userId: data.userId
    });
  });

  // Handle booking confirmation
  socket.on('booking-confirmed', (data) => {
    console.log(`Booking confirmed for seats: ${data.seats.join(', ')} by user ${data.userId}`);
    socket.to(`show-${data.showId}`).emit('seats-booked', {
      seats: data.seats,
      userId: data.userId
    });
  });

  // Handle booking cancellation
  socket.on('booking-cancelled', (data) => {
    console.log(`Booking cancelled for seats: ${data.seats.join(', ')}`);
    socket.to(`show-${data.showId}`).emit('seats-unbooked', {
      seats: data.seats
    });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error('Shutting down...');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(` MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
});