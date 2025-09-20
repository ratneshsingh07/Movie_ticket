// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// // Define User schema directly here to avoid import issues
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' }
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// async function createAdmin() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');

//     // Check if admin already exists
//     const existingAdmin = await User.findOne({ email: 'admin@moviebooking.com' });
    
//     if (existingAdmin) {
//       console.log('Admin user already exists');
      
//       // Test password
//       const isMatch = await existingAdmin.comparePassword('admin123');
//       console.log('Password test result:', isMatch);
      
//       if (!isMatch) {
//         console.log('Updating admin password...');
//         existingAdmin.password = 'admin123';
//         await existingAdmin.save();
//         console.log('Admin password updated');
//       }
//     } else {
//       // Create new admin user
//       const admin = new User({
//         name: 'Admin User',
//         email: 'admin@moviebooking.com',
//         password: 'admin123', // Will be hashed by pre-save hook
//         role: 'admin'
//       });

//       await admin.save();
//       console.log('Admin user created successfully');
//     }

//     // Verify the admin user
//     const admin = await User.findOne({ email: 'admin@moviebooking.com' });
//     console.log('Admin user details:', {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//       hasPassword: !!admin.password
//     });

//     // Test login
//     const passwordTest = await admin.comparePassword('admin123');
//     console.log('Password verification test:', passwordTest);

//     process.exit(0);
//   } catch (error) {
//     console.error('Error:', error);
//     process.exit(1);
//   }
// }

// createAdmin();