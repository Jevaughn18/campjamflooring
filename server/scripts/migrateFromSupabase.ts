import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import GalleryProject from '../models/GalleryProject';
import Review from '../models/Review';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://bwhjvxiuemwbtwqgzpfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3aGp2eGl1ZW13YnR3cWd6cGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTUwNzgsImV4cCI6MjA3OTU3MTA3OH0.CGeEa2phIW2j9upjTwSLTLc87tNv1pzpGLR5AsDEYmU';

const supabase = createClient(supabaseUrl, supabaseKey);

const migrateData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    console.log('\n========================================');
    console.log('Starting Supabase to MongoDB Migration');
    console.log('========================================\n');

    // Migrate Gallery Projects
    console.log('📸 Migrating Gallery Projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('gallery_projects')
      .select('*');

    if (projectsError) {
      console.error('Error fetching projects from Supabase:', projectsError);
    } else if (projects && projects.length > 0) {
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
          title: project.title,
          description: project.description,
          imageUrl: project.image_url,
          category: project.category,
          displayOrder: project.display_order || 0,
          isPublished: project.is_published !== false,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
        });

        console.log(`  ✅ Migrated: "${project.title}"`);
        migratedCount++;
      }

      console.log(`\n✨ Gallery Projects: ${migratedCount} migrated, ${skippedCount} skipped\n`);
    } else {
      console.log('  ℹ️  No gallery projects found in Supabase\n');
    }

    // Migrate Reviews
    console.log('⭐ Migrating Reviews...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*');

    if (reviewsError) {
      console.error('Error fetching reviews from Supabase:', reviewsError);
    } else if (reviews && reviews.length > 0) {
      let migratedCount = 0;
      let skippedCount = 0;

      for (const review of reviews) {
        // Check if already exists (by name, comment, and rating)
        const existing = await Review.findOne({
          name: review.name,
          comment: review.comment,
          rating: review.rating,
        });

        if (existing) {
          console.log(`  ⏭️  Skipping review by "${review.name}" (already exists)`);
          skippedCount++;
          continue;
        }

        await Review.create({
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
        });

        console.log(`  ✅ Migrated: Review by "${review.name}"`);
        migratedCount++;
      }

      console.log(`\n✨ Reviews: ${migratedCount} migrated, ${skippedCount} skipped\n`);
    } else {
      console.log('  ℹ️  No reviews found in Supabase\n');
    }

    console.log('========================================');
    console.log('✅ Migration Complete!');
    console.log('========================================\n');

    console.log('📊 Summary:');
    const totalProjects = await GalleryProject.countDocuments();
    const totalReviews = await Review.countDocuments();
    console.log(`   Gallery Projects in MongoDB: ${totalProjects}`);
    console.log(`   Reviews in MongoDB: ${totalReviews}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateData();
