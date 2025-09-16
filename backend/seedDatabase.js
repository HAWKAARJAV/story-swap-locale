const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// Database connection setup
const { connectDB } = require('./config/database');

// Import models
const User = require('../database/models/User');
const Story = require('../database/models/Story');
const Comment = require('../database/models/Comment');
const Location = require('../database/models/Location');

// For potential Likes if we have that model
let Like;
try {
  Like = require('../database/models/Like');
} catch (error) {
  console.log('Like model not found, skipping likes...');
}

async function loadDataset() {
  try {
    const datasetPath = '/Users/aarjavjain/Downloads/hyperlocal_story_swap_dataset.json';
    console.log('Loading dataset from:', datasetPath);
    
    const rawData = await fs.readFile(datasetPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading dataset:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connection established successfully.');

    // Load dataset
    const dataset = await loadDataset();
    console.log('✅ Dataset loaded successfully.');

    let createdCount = {
      cities: 0,
      users: 0,
      stories: 0,
      comments: 0,
      likes: 0
    };

    // City coordinates mapping
    const cityCoordinates = {
      'Delhi': [77.2090, 28.6139],
      'Mumbai': [72.8777, 19.0760],
      'Jaipur': [75.7873, 26.9124],
      'Agra': [78.0081, 27.1767],
      'Bengaluru': [77.5946, 12.9716]
    };

    // Seed Cities/Locations
    console.log('\n🏙️ Seeding cities...');
    for (const city of dataset.cities) {
      try {
        const existingLocation = await Location.findOne({ 'address.city': city.name });
        
        if (!existingLocation) {
          const coords = cityCoordinates[city.name] || [0, 0];
          const location = new Location({
            coordinates: {
              type: 'Point',
              coordinates: coords
            },
            address: {
              formatted: `${city.name}, ${city.state}, ${city.country}`,
              city: city.name,
              state: city.state,
              country: city.country
            },
            metadata: {
              type: 'poi', // point of interest
              source: 'manual'
            }
          });
          
          await location.save();
          createdCount.cities++;
          console.log(`   ✓ Created city: ${city.name}`);
        } else {
          console.log(`   → City already exists: ${city.name}`);
        }
      } catch (error) {
        console.error(`   ✗ Error creating city ${city.name}:`, error.message);
      }
    }

    // Seed Users
    console.log('\n👥 Seeding users...');
    for (const user of dataset.users) {
      try {
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const dbUser = new User({
            username: user.name.toLowerCase().replace(/\s+/g, '_'),
            displayName: user.name,
            email: user.email,
            password: 'password123', // Default password (will be hashed by pre-save hook)
            avatar: { url: user.profile_pic_url },
            bio: user.bio,
            homeCity: user.location,
            createdAt: new Date(user.created_at)
          });
          
          await dbUser.save();
          createdCount.users++;
          console.log(`   ✓ Created user: ${user.name} (${user.email})`);
        } else {
          console.log(`   → User already exists: ${user.email}`);
        }
      } catch (error) {
        console.error(`   ✗ Error creating user ${user.name}:`, error.message);
      }
    }

    // Seed Stories
    console.log('\n📝 Seeding stories...');
    for (const story of dataset.stories) {
      try {
        // Find the user by the original user_id mapping
        const originalUser = dataset.users.find(u => u.id === story.user_id);
        const dbUser = await User.findOne({ email: originalUser.email });
        
        if (!dbUser) {
          console.error(`   ✗ User not found for story ${story.title}`);
          continue;
        }

        // Find location
        const location = await Location.findOne({ 'address.city': story.location });
        
        const existingStory = await Story.findOne({ 
          title: story.title,
          author: dbUser._id 
        });
        
        if (!existingStory) {
          const dbStory = new Story({
            author: dbUser._id,
            title: story.title,
            content: {
              type: 'text',
              text: {
                body: story.content,
                wordCount: story.content.split(' ').length
              },
              snippet: story.content.substring(0, 150)
            },
            location: location ? location._id : null,
            tags: story.tags,
            status: 'published',
            publishedAt: new Date(story.created_at),
            createdAt: new Date(story.created_at)
          });
          
          await dbStory.save();
          createdCount.stories++;
          console.log(`   ✓ Created story: ${story.title} by ${originalUser.name}`);
        } else {
          console.log(`   → Story already exists: ${story.title}`);
        }
      } catch (error) {
        console.error(`   ✗ Error creating story ${story.title}:`, error.message);
      }
    }

    // Seed Comments
    console.log('\n💬 Seeding comments...');
    for (const comment of dataset.comments) {
      try {
        // Find original user and story
        const originalUser = dataset.users.find(u => u.id === comment.user_id);
        const originalStory = dataset.stories.find(s => s.id === comment.story_id);
        
        const dbUser = await User.findOne({ email: originalUser.email });
        const storyAuthor = dataset.users.find(u => u.id === originalStory.user_id);
        const storyAuthorUser = await User.findOne({ email: storyAuthor.email });
        const dbStory = await Story.findOne({ 
          title: originalStory.title,
          author: storyAuthorUser._id
        });

        if (!dbUser || !dbStory) {
          console.error(`   ✗ User or story not found for comment ${comment.id}`);
          continue;
        }

        const existingComment = await Comment.findOne({
          content: comment.content,
          author: dbUser._id,
          story: dbStory._id
        });
        
        if (!existingComment) {
          const dbComment = new Comment({
            author: dbUser._id,
            story: dbStory._id,
            content: comment.content,
            createdAt: new Date(comment.created_at)
          });
          
          await dbComment.save();
          createdCount.comments++;
          console.log(`   ✓ Created comment by ${originalUser.name} on "${originalStory.title}"`);
        } else {
          console.log(`   → Comment already exists`);
        }
      } catch (error) {
        console.error(`   ✗ Error creating comment ${comment.id}:`, error.message);
      }
    }

    // Seed Likes (if Like model exists)
    console.log('\n❤️ Seeding likes...');
    if (Like && dataset.likes && Array.isArray(dataset.likes)) {
      for (const like of dataset.likes) {
        try {
          const originalUser = dataset.users.find(u => u.id === like.user_id);
          const originalStory = dataset.stories.find(s => s.id === like.story_id);
          
          const dbUser = await User.findOne({ email: originalUser.email });
          const storyAuthor = dataset.users.find(u => u.id === originalStory.user_id);
          const storyAuthorUser = await User.findOne({ email: storyAuthor.email });
          const dbStory = await Story.findOne({ 
            title: originalStory.title,
            author: storyAuthorUser._id
          });

          if (!dbUser || !dbStory) {
            console.error(`   ✗ User or story not found for like ${like.id}`);
            continue;
          }

          const existingLike = await Like.findOne({
            user: dbUser._id,
            story: dbStory._id
          });
          
          if (!existingLike) {
            const dbLike = new Like({
              user: dbUser._id,
              story: dbStory._id,
              createdAt: new Date(like.created_at)
            });
            
            await dbLike.save();
            createdCount.likes++;
            console.log(`   ✓ Created like by ${originalUser.name} for "${originalStory.title}"`);
          } else {
            console.log(`   → Like already exists`);
          }
        } catch (error) {
          console.error(`   ✗ Error creating like ${like.id}:`, error.message);
        }
      }
    } else {
      console.log('   → Skipping likes (Like model not available or no likes data)');
    }

    // Summary
    console.log('\n📊 SEEDING SUMMARY:');
    console.log(`   🏙️ Cities: ${createdCount.cities} created`);
    console.log(`   👥 Users: ${createdCount.users} created`);
    console.log(`   📖 Stories: ${createdCount.stories} created`);
    console.log(`   💬 Comments: ${createdCount.comments} created`);
    console.log(`   ❤️ Likes: ${createdCount.likes} created`);

    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase, loadDataset };