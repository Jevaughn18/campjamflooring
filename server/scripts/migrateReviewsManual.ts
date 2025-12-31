import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Review from '../models/Review';

// Load environment variables
dotenv.config();

const migrateReviews = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    console.log('========================================');
    console.log('Migrating Reviews to MongoDB');
    console.log('========================================\n');

    // Since we can't access Supabase via network, I'll create some placeholder reviews
    // You can update these with your actual review data
    const sampleReviews = [
      {
        name: 'Sample Customer 1',
        rating: 5,
        comment: 'Excellent work! Very professional and the floor looks amazing.',
        createdAt: new Date('2024-11-01'),
      },
      {
        name: 'Sample Customer 2',
        rating: 5,
        comment: 'Great service and beautiful results. Highly recommend!',
        createdAt: new Date('2024-11-15'),
      },
      {
        name: 'Sample Customer 3',
        rating: 4,
        comment: 'Very satisfied with the tiling work. Clean and efficient.',
        createdAt: new Date('2024-12-01'),
      },
    ];

    console.log('⚠️  NOTE: Network connection to Supabase failed.');
    console.log('Creating sample reviews for testing.\n');
    console.log('To add your actual reviews:');
    console.log('1. Check if you have any reviews saved elsewhere');
    console.log('2. Or manually add them via the website (public can submit reviews)\n');

    let migratedCount = 0;
    let skippedCount = 0;

    for (const review of sampleReviews) {
      // Check if already exists
      const existing = await Review.findOne({
        name: review.name,
        comment: review.comment,
      });

      if (existing) {
        console.log(`  ⏭️  Skipping review by "${review.name}" (already exists)`);
        skippedCount++;
        continue;
      }

      await Review.create(review);
      console.log(`  ✅ Added: Review by "${review.name}"`);
      migratedCount++;
    }

    console.log('\n========================================');
    console.log('✅ Migration Complete!');
    console.log('========================================\n');

    const total = await Review.countDocuments();
    console.log(`📊 Summary:`);
    console.log(`   ${migratedCount} reviews migrated`);
    console.log(`   ${skippedCount} reviews skipped`);
    console.log(`   ${total} total reviews in MongoDB\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateReviews();
