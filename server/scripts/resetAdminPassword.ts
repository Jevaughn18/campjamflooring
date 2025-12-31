import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load environment variables
dotenv.config();

const resetAdminPassword = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'stewartjevaughn1@gmail.com' });

    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    // Set new password
    const newPassword = 'Admin2025!';
    admin.password = newPassword;
    await admin.save();

    console.log('========================================');
    console.log('✅ Password Reset Successfully!');
    console.log('========================================\n');
    console.log('Email: stewartjevaughn1@gmail.com');
    console.log(`Password: ${newPassword}`);
    console.log('\n⚠️  IMPORTANT: Save this password somewhere safe!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
