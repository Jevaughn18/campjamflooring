import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrateGallerySchema = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get the collection directly
    const db = mongoose.connection.db;
    const collection = db.collection('galleryprojects');

    // Find all projects with old schema (imageUrl field)
    const oldProjects = await collection.find({ imageUrl: { $exists: true } }).toArray();

    console.log(`Found ${oldProjects.length} projects to migrate`);

    for (const project of oldProjects) {
      console.log(`Migrating project: ${project.title}`);

      // Update to new schema
      await collection.updateOne(
        { _id: project._id },
        {
          $set: {
            thumbnail: project.imageUrl,
            media: []
          },
          $unset: {
            imageUrl: ''
          }
        }
      );
    }

    console.log('Migration complete!');

    // Verify migration
    const updatedProjects = await collection.find({}).toArray();
    console.log('\nUpdated projects:');
    updatedProjects.forEach(p => {
      console.log(`- ${p.title}: thumbnail=${p.thumbnail}, media=${JSON.stringify(p.media)}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateGallerySchema();
