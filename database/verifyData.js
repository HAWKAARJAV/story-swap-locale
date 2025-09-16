const mongoose = require('mongoose');
const { connectDB } = require('./config/database');

// Import models
const User = require('./models/User');
const Story = require('./models/Story');
const Comment = require('./models/Comment');
const Location = require('./models/Location');

async function verifyData() {
  try {
    await connectDB();
    console.log('📊 DATABASE VERIFICATION');
    console.log('========================');
    
    // Count documents
    const userCount = await User.countDocuments();
    console.log('👥 Users:', userCount);
    
    const storyCount = await Story.countDocuments();
    console.log('📖 Stories:', storyCount);
    
    const commentCount = await Comment.countDocuments();
    console.log('💬 Comments:', commentCount);
    
    const locationCount = await Location.countDocuments();
    console.log('🏙️ Locations:', locationCount);
    
    // Show sample data
    console.log('\n📝 Sample Stories:');
    const sampleStories = await Story.find()
      .populate('author', 'displayName email')
      .limit(5);
    
    for (const story of sampleStories) {
      console.log(`   • "${story.title}" by ${story.author?.displayName || 'Unknown'}`);
    }
    
    console.log('\n🏙️ Sample Locations:');
    const sampleLocations = await Location.find().limit(5);
    for (const location of sampleLocations) {
      console.log(`   • ${location.address.city}, ${location.address.country}`);
    }
    
    console.log('\n👥 Sample Users:');
    const sampleUsers = await User.find().limit(5);
    for (const user of sampleUsers) {
      console.log(`   • ${user.displayName} (${user.email}) from ${user.homeCity}`);
    }
    
    console.log('\n💬 Sample Comments:');
    const sampleComments = await Comment.find()
      .populate('author', 'displayName')
      .populate('story', 'title')
      .limit(3);
      
    for (const comment of sampleComments) {
      console.log(`   • ${comment.author?.displayName} on "${comment.story?.title}": ${comment.content}`);
    }
    
    console.log('\n✅ Database verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

// Run verification
if (require.main === module) {
  verifyData()
    .then(() => {
      console.log('✅ Verification process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyData };