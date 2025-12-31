import dotenv from 'dotenv';
import mongoose from 'mongoose';
import GalleryProject from '../models/GalleryProject';

// Load environment variables
dotenv.config();

const addSampleProjects = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    // Check if projects already exist
    const existingCount = await GalleryProject.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  You already have ${existingCount} project(s) in the database.`);
      console.log('This script adds sample projects for testing purposes.\n');

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // For automated environments, skip if projects exist
      if (process.env.CI) {
        console.log('Skipping sample data creation.');
        process.exit(0);
      }
    }

    console.log('📸 Adding sample gallery projects...\n');

    const sampleProjects = [
      {
        title: 'Modern Kitchen Floor',
        description: 'Beautiful luxury vinyl plank flooring installation in a contemporary kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1556911073-52527ac43761?w=800',
        category: 'Kitchen',
        displayOrder: 3,
        isPublished: true,
      },
      {
        title: 'Elegant Bathroom Tiles',
        description: 'Premium porcelain tile installation with modern geometric patterns',
        imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
        category: 'Bathroom',
        displayOrder: 2,
        isPublished: true,
      },
      {
        title: 'Living Room Hardwood',
        description: 'Classic oak hardwood flooring with rich natural tones',
        imageUrl: 'https://images.unsplash.com/photo-1615875474908-f403486c7e1b?w=800',
        category: 'Living Room',
        displayOrder: 1,
        isPublished: true,
      },
    ];

    for (const project of sampleProjects) {
      await GalleryProject.create(project);
      console.log(`  ✅ Added: "${project.title}"`);
    }

    console.log('\n✨ Sample projects added successfully!\n');

    const total = await GalleryProject.countDocuments();
    console.log(`📊 Total projects in database: ${total}\n`);

    console.log('🎨 You can now:');
    console.log('   1. View these projects on your gallery page');
    console.log('   2. Log in to admin panel to add your own projects');
    console.log('   3. Delete these samples and add real project images\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample projects:', error);
    process.exit(1);
  }
};

addSampleProjects();
