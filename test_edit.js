import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testEdit = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const collection = db.collection('galleryprojects');
    
    // Get Project #1 to see its structure
    const project1 = await collection.findOne({ title: 'Project #1' });
    
    console.log('=== Project #1 Structure ===');
    console.log(JSON.stringify(project1, null, 2));
    
    console.log('\n=== Media Array ===');
    console.log(`Media count: ${project1.media?.length || 0}`);
    if (project1.media) {
      project1.media.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.type}: ${item.url}`);
      });
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testEdit();
