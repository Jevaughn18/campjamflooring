import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import GalleryProject from '../models/GalleryProject';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrateLocalProjects = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    console.log('========================================');
    console.log('Migrating Local Project Images');
    console.log('========================================\n');

    // Define your 6 projects based on the local assets
    const projects = [
      {
        title: 'Project #1',
        description: 'Professional flooring installation project',
        imageUrl: '/uploads/project1/Project1Thumbnail.png',
        category: 'Flooring',
        displayOrder: 6,
      },
      {
        title: 'Project #2',
        description: 'Premium tile installation',
        imageUrl: '/uploads/project2/project2thumbnail.jpeg',
        category: 'Tiling',
        displayOrder: 5,
      },
      {
        title: 'Project #3',
        description: 'Custom flooring solution',
        imageUrl: '/uploads/project3/thumbnail.jpeg',
        category: 'Flooring',
        displayOrder: 4,
      },
      {
        title: 'Project #4',
        description: 'Modern tile design',
        imageUrl: '/uploads/project4/thumbnail.jpeg',
        category: 'Tiling',
        displayOrder: 3,
      },
      {
        title: 'Project #5',
        description: 'Residential flooring project',
        imageUrl: '/uploads/project5/thumbnail.jpeg',
        category: 'Flooring',
        displayOrder: 2,
      },
      {
        title: 'Project #6',
        description: 'Complete floor renovation',
        imageUrl: '/uploads/project6/thumbnail.jpeg',
        category: 'Flooring',
        displayOrder: 1,
      },
    ];

    let migratedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
      // Check if already exists
      const existing = await GalleryProject.findOne({ title: project.title });
      if (existing) {
        console.log(`  ⏭️  Skipping "${project.title}" (already exists)`);
        skippedCount++;
        continue;
      }

      await GalleryProject.create({
        ...project,
        isPublished: true,
      });

      console.log(`  ✅ Migrated: "${project.title}"`);
      migratedCount++;
    }

    console.log('\n========================================');
    console.log('✅ Migration Complete!');
    console.log('========================================\n');

    console.log(`📊 Summary:`);
    console.log(`   ${migratedCount} projects migrated`);
    console.log(`   ${skippedCount} projects skipped (already existed)`);

    const total = await GalleryProject.countDocuments();
    console.log(`   ${total} total projects in MongoDB\n`);

    console.log('⚠️  IMPORTANT NEXT STEP:');
    console.log('   The images are currently referenced from /src/assets/');
    console.log('   You need to either:');
    console.log('   1. Copy images to public/uploads/ folder, OR');
    console.log('   2. Use the admin panel to re-upload the images\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateLocalProjects();
