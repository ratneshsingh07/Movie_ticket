// server.js
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

// Initialize app & server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB().then(async () => {
  // Only seed database locally
  if (process.env.NODE_ENV === 'development') {
    const User = require('./models/User');
    const existingAdmin = await User.findOne({ email: 'admin@moviebooking.com' });
    if (!existingAdmin) {
      console.log('Creating admin user...');
      await User.create({
        name: 'Admin User',
        email: 'admin@moviebooking.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin already exists, skipping seeding');
    }
  }
}).catch(err => console.error('DB connection failed:', err));

// Middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make Socket.io available in routes
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

// Root route
app.get('/', (req, res) => {
  res.send('🎬 Movie Booking Backend is running!');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io events
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-show', showId => socket.join(`show-${showId}`));

  socket.on('seat-selected', data => {
    socket.to(`show-${data.showId}`).emit('seat-blocked', data);
  });

  socket.on('seat-deselected', data => {
    socket.to(`show-${data.showId}`).emit('seat-unblocked', data);
  });

  socket.on('booking-confirmed', data => {
    socket.to(`show-${data.showId}`).emit('seats-booked', data);
  });

  socket.on('booking-cancelled', data => {
    socket.to(`show-${data.showId}`).emit('seats-unbooked', data);
  });

  socket.on('disconnect', reason => console.log('User disconnected:', socket.id, reason));
  socket.on('error', err => console.error('Socket error:', err));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Unhandled rejections/exceptions
process.on('unhandledRejection', err => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
