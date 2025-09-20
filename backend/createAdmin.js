
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple User schema without pre-hooks
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete any existing admin users
    await User.deleteMany({ email: 'admin@moviebooking.com' });
    console.log('Cleaned up existing admin users');

    // Manually hash the password
    const plainPassword = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('Password details:');
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);

    // Create admin user with pre-hashed password
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@moviebooking.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    // Verify password works
    const testUser = await User.findOne({ email: 'admin@moviebooking.com' });
    const passwordMatch = await bcrypt.compare(plainPassword, testUser.password);
    
    console.log('Password verification:', passwordMatch);
    
    if (passwordMatch) {
      console.log(' SUCCESS! Admin user created and password verified');
      console.log('You can now login with:');
      console.log('Email: admin@moviebooking.com');
      console.log('Password: admin123');
    } else {
      console.log(' Password verification failed');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdminUser();