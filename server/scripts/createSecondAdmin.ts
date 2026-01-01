import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config();

const createSecondAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'allyandre64@gmail.com' });

    if (existingAdmin) {
      console.log('✅ Admin user allyandre64@gmail.com already exists');
      console.log('Email: allyandre64@gmail.com');
      console.log('Password: CampJam2025!\n');
      process.exit(0);
    }

    // Create second admin user
    const admin = new User({
      email: 'allyandre64@gmail.com',
      password: 'CampJam2025!',
      isActive: true,
      createdBy: 'system',
    });

    await admin.save();

    console.log('========================================');
    console.log('✅ Second Admin Created Successfully!');
    console.log('========================================\n');
    console.log('Email: allyandre64@gmail.com');
    console.log('Password: CampJam2025!');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createSecondAdmin();
