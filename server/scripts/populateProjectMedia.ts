import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const populateProjectMedia = async () => {
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

    const uploadsDir = path.join(__dirname, '../../public/uploads');

    for (const project of projects) {
      console.log(`\nProcessing: ${project.title}`);
      console.log(`Thumbnail: ${project.thumbnail}`);

      // Extract project folder from thumbnail path
      // e.g., "/uploads/project1/Project1Thumbnail.png" -> "project1"
      const thumbnailPath = project.thumbnail;
      const match = thumbnailPath.match(/\/uploads\/(project\d+)\//);

      if (!match) {
        console.log(`  ⚠️  Could not extract project folder from ${thumbnailPath}`);
        continue;
      }

      const projectFolder = match[1];
      const projectDir = path.join(uploadsDir, projectFolder);

      if (!fs.existsSync(projectDir)) {
        console.log(`  ⚠️  Directory not found: ${projectDir}`);
        continue;
      }

      // Get all image files in the project directory (excluding thumbnail and videos)
      const files = fs.readdirSync(projectDir);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const videoExtensions = ['.mp4', '.mov', '.avi'];

      const media = [];

      for (const file of files) {
        const filePath = `/uploads/${projectFolder}/${file}`;
        const ext = path.extname(file).toLowerCase();

        // Skip if this is the thumbnail
        if (filePath === project.thumbnail) {
          continue;
        }

        if (imageExtensions.includes(ext)) {
          media.push({ type: 'image', url: filePath });
          console.log(`  ✓ Added image: ${file}`);
        } else if (videoExtensions.includes(ext)) {
          media.push({ type: 'video', url: filePath });
          console.log(`  ✓ Added video: ${file}`);
        }
      }

      // Update project with media array
      await collection.updateOne(
        { _id: project._id },
        { $set: { media } }
      );

      console.log(`  → Updated with ${media.length} media items`);
    }

    console.log('\n✅ Media population complete!');

    // Show final state
    const updatedProjects = await collection.find({}).toArray();
    console.log('\nFinal project media counts:');
    for (const p of updatedProjects) {
      console.log(`  ${p.title}: ${p.media?.length || 0} items`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateProjectMedia();
