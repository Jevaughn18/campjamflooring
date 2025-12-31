import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'stewartjevaughn1@gmail.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: 'stewartjevaughn1@gmail.com',
      password: 'ChangeMe123!', // IMPORTANT: Change this password immediately after first login
      isActive: true,
      createdBy: 'system',
    });

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email: stewartjevaughn1@gmail.com');
    console.log('Password: ChangeMe123!');
    console.log('\n⚠️  IMPORTANT: Please change the password immediately after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
