
// const mongoose = require('mongoose');
// const User = require('../models/User');
// require('dotenv').config();

// async function resetAdmin() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');

//     // Delete existing admin user
//     await User.deleteOne({ email: 'admin@moviebooking.com' });
//     console.log('Existing admin user deleted (if any)');

//     // Create new admin user (password will be hashed by the pre-save hook)
//     const admin = new User({
//       name: 'Admin User',
//       email: 'admin@moviebooking.com',
//       password: 'admin123',
//       role: 'admin'
//     });

//     await admin.save();
//     console.log('New admin user created successfully');

//     // Verify the admin user
//     const verifyAdmin = await User.findOne({ email: 'admin@moviebooking.com' }).select('+password');
//     console.log('Admin user verified:', {
//       id: verifyAdmin._id,
//       name: verifyAdmin.name,
//       email: verifyAdmin.email,
//       role: verifyAdmin.role,
//       hasPassword: !!verifyAdmin.password
//     });

//     // Test password comparison
//     const passwordTest = await verifyAdmin.comparePassword('admin123');
//     console.log('Password verification test:', passwordTest);

//     if (passwordTest) {
//       console.log('✅ Admin user is ready for login!');
//       console.log('Email: admin@moviebooking.com');
//       console.log('Password: admin123');
//     } else {
//       console.log('❌ Password verification failed');
//     }

//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// }

// resetAdmin();