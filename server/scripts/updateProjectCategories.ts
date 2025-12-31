import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateProjectCategories = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('galleryprojects');

    // Get all projects
    const projects = await collection.find({}).toArray();
    console.log(`Found ${projects.length} projects\n`);

    // Update categories to match the new schema
    for (const project of projects) {
      let newCategory = 'Tiling';

      // Map old categories to new ones
      if (project.category === 'Glass' || project.title.toLowerCase().includes('glass')) {
        newCategory = 'Glass Installations';
      } else if (project.category === 'Flooring' || project.category === 'Tiling') {
        newCategory = 'Tiling';
      }

      await collection.updateOne(
        { _id: project._id },
        { $set: { category: newCategory } }
      );
      console.log(`✓ Updated "${project.title}" from "${project.category}" to "${newCategory}"`);
    }

    console.log('\n✅ Category update complete!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProjectCategories();
