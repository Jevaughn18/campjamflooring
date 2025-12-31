import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectAndCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const GalleryProject = mongoose.model('GalleryProject', new mongoose.Schema({}, { strict: false }));
    const projects = await GalleryProject.find({});
    
    console.log('\n=== Projects in Database ===');
    console.log(JSON.stringify(projects, null, 2));
    console.log(`\nTotal projects: ${projects.length}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

connectAndCheck();
