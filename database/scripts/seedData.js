const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Story = require('../models/Story');
const Location = require('../models/Location');
const Tag = require('../models/Tag');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperlocal-story-swap');

const seedUsers = [
  {
    _id: 'admin-user-001',
    email: 'admin@storyswap.com',
    username: 'admin',
    displayName: 'Admin User',
    password: 'admin123',
    role: 'admin',
    homeCity: 'Delhi',
    bio: 'Platform administrator and story curator',
    verification: { email: { isVerified: true } }
  },
  {
    _id: 'user-rita-delhi',
    email: 'rita@example.com',
    username: 'rita_delhi',
    displayName: 'Rita Sharma',
    password: 'test1234',
    role: 'user',
    homeCity: 'Delhi',
    bio: 'Delhi explorer and heritage enthusiast. Love sharing stories of Old Delhi.',
    verification: { email: { isVerified: true } },
    stats: { storiesPublished: 8, swapsCompleted: 15 }
  },
  {
    _id: 'user-sam-chennai',
    email: 'sam@example.com',
    username: 'sam_chennai',
    displayName: 'Sameer Kumar',
    password: 'test1234',
    role: 'user',
    homeCity: 'Chennai',
    bio: 'Chennaiite by heart, storyteller by passion. Marina Beach is my second home.',
    verification: { email: { isVerified: true } },
    stats: { storiesPublished: 6, swapsCompleted: 12 }
  },
  {
    _id: 'user-aarav-jaipur',
    email: 'aarav@example.com',
    username: 'aarav_jaipur',
    displayName: 'Aarav Singh',
    password: 'test1234',
    role: 'user',
    homeCity: 'Jaipur',
    bio: 'Pink City poet and heritage guide. Every stone in Jaipur has a story.',
    verification: { email: { isVerified: true } },
    stats: { storiesPublished: 7, swapsCompleted: 18 }
  },
  {
    _id: 'user-priya-mumbai',
    email: 'priya@example.com',
    username: 'priya_mumbai',
    displayName: 'Priya Desai',
    password: 'test1234',
    role: 'user',
    homeCity: 'Mumbai',
    bio: 'Mumbai local train stories and street food adventures. Life is fast here.',
    verification: { email: { isVerified: true } },
    stats: { storiesPublished: 9, swapsCompleted: 20 }
  },
  {
    _id: 'user-arjun-agra',
    email: 'arjun@example.com',
    username: 'arjun_agra',
    displayName: 'Arjun Gupta',
    password: 'test1234',
    role: 'user',
    homeCity: 'Agra',
    bio: 'Agra born and raised. Beyond the Taj lies a city of incredible stories.',
    verification: { email: { isVerified: true } },
    stats: { storiesPublished: 5, swapsCompleted: 11 }
  }
];

const seedLocations = [
  // Delhi Locations
  {
    _id: 'loc-chandni-chowk',
    coordinates: { type: 'Point', coordinates: [77.2300, 28.6562] },
    address: {
      formatted: 'Chandni Chowk, Old Delhi, New Delhi, India',
      neighborhood: 'Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  {
    _id: 'loc-india-gate',
    coordinates: { type: 'Point', coordinates: [77.2295, 28.6129] },
    address: {
      formatted: 'India Gate, Rajpath, New Delhi, India',
      neighborhood: 'India Gate',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  {
    _id: 'loc-lodhi-gardens',
    coordinates: { type: 'Point', coordinates: [77.2199, 28.5918] },
    address: {
      formatted: 'Lodhi Gardens, New Delhi, India',
      neighborhood: 'Lodhi Road',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  
  // Mumbai Locations
  {
    _id: 'loc-marine-drive',
    coordinates: { type: 'Point', coordinates: [72.8239, 18.9441] },
    address: {
      formatted: 'Marine Drive, Mumbai, Maharashtra, India',
      neighborhood: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  {
    _id: 'loc-gateway-india',
    coordinates: { type: 'Point', coordinates: [72.8347, 18.9220] },
    address: {
      formatted: 'Gateway of India, Apollo Bandar, Mumbai, India',
      neighborhood: 'Colaba',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  
  // Jaipur Locations
  {
    _id: 'loc-hawa-mahal',
    coordinates: { type: 'Point', coordinates: [75.8267, 26.9239] },
    address: {
      formatted: 'Hawa Mahal, Badi Choupad, Jaipur, Rajasthan, India',
      neighborhood: 'Pink City',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  {
    _id: 'loc-amer-fort',
    coordinates: { type: 'Point', coordinates: [75.8515, 26.9855] },
    address: {
      formatted: 'Amer Fort, Amer, Jaipur, Rajasthan, India',
      neighborhood: 'Amer',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  
  // Chennai Locations
  {
    _id: 'loc-marina-beach',
    coordinates: { type: 'Point', coordinates: [80.2785, 13.0475] },
    address: {
      formatted: 'Marina Beach, Chennai, Tamil Nadu, India',
      neighborhood: 'Marina',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  },
  
  // Agra Locations
  {
    _id: 'loc-taj-mahal',
    coordinates: { type: 'Point', coordinates: [78.0421, 27.1751] },
    address: {
      formatted: 'Taj Mahal, Agra, Uttar Pradesh, India',
      neighborhood: 'Taj Ganj',
      city: 'Agra',
      state: 'Uttar Pradesh',
      country: 'India'
    },
    metadata: { type: 'landmark', source: 'manual' }
  }
];

const seedTags = [
  { _id: 'tag-food', name: 'food', displayName: 'Food', category: 'food', color: '#FF6B35' },
  { _id: 'tag-history', name: 'history', displayName: 'History', category: 'history', color: '#8B5A2B' },
  { _id: 'tag-culture', name: 'culture', displayName: 'Culture', category: 'culture', color: '#6A4C93' },
  { _id: 'tag-memory', name: 'memory', displayName: 'Memory', category: 'people', color: '#FF8C94' },
  { _id: 'tag-hidden-gem', name: 'hidden gem', displayName: 'Hidden Gem', category: 'hidden-gems', color: '#00B4D8' },
  { _id: 'tag-festival', name: 'festival', displayName: 'Festival', category: 'events', color: '#F72585' },
  { _id: 'tag-art', name: 'art', displayName: 'Art', category: 'art', color: '#7209B7' },
  { _id: 'tag-heritage', name: 'heritage', displayName: 'Heritage', category: 'history', color: '#A663CC' },
  { _id: 'tag-street-life', name: 'street life', displayName: 'Street Life', category: 'people', color: '#4361EE' },
  { _id: 'tag-love', name: 'love', displayName: 'Love', category: 'people', color: '#E63946' }
];

const seedStories = [
  // Delhi Stories
  {
    _id: 'story-chandni-chowk-tea',
    title: 'The Tea Stall That Remembers Everything',
    content: {
      type: 'text',
      text: {
        body: "There's a tea stall in Chandni Chowk that's been run by the same family since 1971. Raju uncle, now 68, serves the best kulhad chai in Old Delhi. But what makes this place special isn't just the tea—it's the stories.\n\nEvery morning, the same group of uncles gathers here. They've been coming for 30 years, some even longer. They discuss everything from cricket matches to politics, from family weddings to neighborhood gossip.\n\nI discovered this place during college when I was exploring the narrow lanes of Chandni Chowk. Raju uncle noticed I was new and handed me a kulhad of steaming tea. 'Beta, first time in Old Delhi?' he asked with a warm smile.\n\nThat was 15 years ago. Now, whenever I'm stressed about work or life in general, I take the metro to Chandni Chowk and sit at that same tea stall. The kulhad feels warm in my hands, the conversations flow around me like a familiar melody, and for those 20 minutes, I'm home.\n\nRaju uncle still remembers my name, still asks about my family. Some places change with time, but this little corner of Delhi remains exactly as it should be—timeless, warm, and full of stories.",
        wordCount: 198
      },
      snippet: "There's a tea stall in Chandni Chowk that's been run by the same family since 1971. Raju uncle serves the best kulhad chai and remembers every story..."
    },
    author: 'user-rita-delhi',
    location: 'loc-chandni-chowk',
    tags: ['tag-food', 'tag-memory', 'tag-culture'],
    status: 'published',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    engagement: { views: 156, likes: 23, unlocks: 12, comments: 8 }
  },
  
  {
    _id: 'story-india-gate-midnight',
    title: 'Midnight Conversations at India Gate',
    content: {
      type: 'text',
      text: {
        body: "India Gate at midnight is a different world. The tourist crowds are gone, the vendors have packed up, and only the night owls remain. Students with their books, couples holding hands, and insomniacs like me who find peace in the quiet darkness.\n\nI was 22, fresh out of college, and struggling with a job that felt meaningless. Every night after work, I'd take my bike and ride to India Gate. There's something about that monument—it's not just stone and memories of soldiers, it's a lighthouse for lost souls.\n\nOne night, I met an old man sitting alone on the grass. He was feeding biscuits to street dogs and humming an old Kishore Kumar song. We started talking, and he told me he'd been coming here for 40 years, ever since his wife passed away.\n\n'Beta,' he said, 'this place has seen more heartbreaks and new beginnings than any temple or church. People come here when they need to think, to decide, to heal.'\n\nThat conversation changed something in me. I realized I wasn't alone in feeling lost. India Gate wasn't just a monument—it was a gathering place for dreamers, thinkers, and anyone who needed a moment to breathe in a city that never stops.",
        wordCount: 201
      },
      snippet: "India Gate at midnight is a different world. The tourist crowds are gone, and only the night owls remain. Students, couples, and insomniacs finding peace..."
    },
    author: 'user-rita-delhi',
    location: 'loc-india-gate',
    tags: ['tag-memory', 'tag-culture'],
    status: 'published',
    publishedAt: new Date('2024-01-20T14:15:00Z'),
    engagement: { views: 89, likes: 15, unlocks: 8, comments: 5 }
  },

  // Mumbai Stories
  {
    _id: 'story-marine-drive-rains',
    title: 'When Mumbai Cries: Monsoons at Marine Drive',
    content: {
      type: 'text',
      text: {
        body: "The first time I experienced Mumbai monsoons at Marine Drive, I understood why they call this city magical. It was July 2019, and I had just moved here for my first job. Everyone warned me about the rains—floods, traffic jams, chaos. But nobody told me about the beauty.\n\nI was walking along the promenade when the sky opened up. Within minutes, I was soaked to the bone. But instead of running for shelter, I found myself standing there, watching the waves crash against the tetrapods with unprecedented fury.\n\nThe Queen's Necklace lights blurred through the rain, creating abstract art in the darkness. Couples huddled under umbrellas, street vendors quickly covered their stalls, and the city's rhythm changed from frantic to meditative.\n\nAn elderly man in a raincoat approached me. 'First monsoon in Mumbai?' he asked, smiling. I nodded, still mesmerized. 'Beta, this is when Mumbai shows its true face. The rains wash away everything—the dust, the pretense, the hurry. What remains is pure Mumbai.'\n\nThat night, drenched and happy, I called my parents in Indore. 'I think I'm going to love this city,' I told them. Seven years later, Marine Drive during monsoons still feels like coming home to a city that embraces you with open arms and doesn't let you go.",
        wordCount: 218
      },
      snippet: "The first time I experienced Mumbai monsoons at Marine Drive, I understood why they call this city magical. The rains wash away everything, revealing pure Mumbai..."
    },
    author: 'user-priya-mumbai',
    location: 'loc-marine-drive',
    tags: ['tag-memory', 'tag-culture'],
    status: 'published',
    publishedAt: new Date('2024-02-01T16:45:00Z'),
    engagement: { views: 203, likes: 31, unlocks: 18, comments: 12 }
  },

  // Jaipur Stories
  {
    _id: 'story-amer-fort-poetry',
    title: 'The Poetry Wall of Amer Fort',
    content: {
      type: 'text',
      text: {
        body: "Hidden in the labyrinthine corridors of Amer Fort, there's a wall that tourists rarely find. It's covered with carvings—not just decorative patterns, but Urdu poetry that speaks of love, loss, and longing.\n\nI discovered it during my heritage walk guide training in 2020. Our instructor, Dr. Sharma, led us through a narrow passage I'd never noticed before. 'This,' he said, running his fingers over the faded script, 'is where the court poets would practice their craft.'\n\nThe poems are beautiful—some about the changing seasons in Rajasthan, others about the pink city's eternal beauty. But my favorite is a small couplet near the bottom:\n\n'Jaipur ki deewaron mein chhupe hain kitne kisse,\nHar patthar mein basi hai mohabbat ki khushi.'\n\n(In Jaipur's walls hide countless stories, Every stone holds the joy of love.)\n\nNow, whenever I guide tourists through Amer Fort, I always end our tour at this wall. Most people are amazed—they came expecting grand architecture but found something more intimate: the beating heart of Jaipur's literary heritage.\n\nPoetry isn't just written in books here; it's carved in stone, whispered in the wind that blows through the fort's courtyards, and alive in every conversation between the ramparts.",
        wordCount: 201
      },
      snippet: "Hidden in Amer Fort's corridors is a wall covered with Urdu poetry about love, loss, and longing. Court poets practiced their craft here, carving emotions in stone..."
    },
    author: 'user-aarav-jaipur',
    location: 'loc-amer-fort',
    tags: ['tag-art', 'tag-history', 'tag-hidden-gem'],
    status: 'published',
    publishedAt: new Date('2024-01-25T12:20:00Z'),
    engagement: { views: 134, likes: 28, unlocks: 16, comments: 9 }
  },

  // Chennai Stories
  {
    _id: 'story-marina-beach-sunrise',
    title: 'The Fishermen of Marina Beach',
    content: {
      type: 'text',
      text: {
        body: "Every morning at 5 AM, Marina Beach transforms. While the city sleeps, fishermen emerge from the darkness, their colorful boats dotting the shoreline like scattered jewels. This is Chennai's best-kept secret—the daily theater of the sea.\n\nI started my morning runs here three years ago, and slowly became part of this pre-dawn community. Murugan anna, a 55-year-old fisherman, would always wave at me as I jogged past his boat. One day, he called me over.\n\n'Amma, you run here every day. Want to see something special?' He pointed to the horizon where the sun was just beginning to rise. 'Watch the water change color.'\n\nAnd it did. From deep black to purple to orange to gold. The entire Bay of Bengal became a canvas, painted fresh every morning by an artist who never repeats the same masterpiece.\n\nMurugan anna taught me the names of the fish, the patterns of the tides, and the ancient Tamil songs fishermen sing while casting their nets. 'This beach,' he said one morning, 'is not just for morning walkers and evening couples. It feeds families, connects generations, and reminds us that Chennai's heart beats with the rhythm of the sea.'\n\nNow I don't just run on Marina Beach—I participate in its daily rebirth.",
        wordCount: 208
      },
      snippet: "Every morning at 5 AM, Marina Beach transforms. Fishermen emerge from darkness, their boats dotting the shore while the Bay of Bengal becomes a golden canvas..."
    },
    author: 'user-sam-chennai',
    location: 'loc-marina-beach',
    tags: ['tag-culture', 'tag-memory'],
    status: 'published',
    publishedAt: new Date('2024-02-10T07:30:00Z'),
    engagement: { views: 167, likes: 22, unlocks: 11, comments: 7 }
  },

  // Agra Stories
  {
    _id: 'story-taj-sunrise-magic',
    title: 'The Taj Mahal at Sunrise: A Local\'s Secret',
    content: {
      type: 'text',
      text: {
        body: "Everyone sees the Taj Mahal as a symbol of love, but living in Agra, I've learned it has many faces. The most magical one appears at sunrise, when the marble seems to glow from within.\n\nMy grandfather was a guide at the Taj for 40 years. He taught me that the best view isn't from the front—it's from the riverbank behind the monument. 'Beta,' he would say, 'Shah Jahan designed this from every angle. The back view shows you something the crowds never see.'\n\nOne morning, when I was feeling particularly lost after my engineering entrance exam results, he woke me up at 4 AM. 'Come,' he said simply. We cycled through the quiet streets of Agra to the Yamuna riverbank.\n\nAs the sun rose, the Taj Mahal transformed. The white marble turned pink, then gold, then back to pristine white. But from where we sat, we could see the intricate inlay work catching the light, creating patterns that seemed alive.\n\n'This is what people miss,' my grandfather said. 'They see the Taj as a monument to death. But look at how it dances with the sun every morning. It's a monument to life, to beauty that refuses to fade.'\n\nThat sunrise changed my perspective—not just about the Taj, but about finding beauty in familiar places.",
        wordCount: 221
      },
      snippet: "The Taj Mahal has many faces, but the most magical appears at sunrise when the marble glows from within. A local's secret view from the riverbank reveals its true beauty..."
    },
    author: 'user-arjun-agra',
    location: 'loc-taj-mahal',
    tags: ['tag-heritage', 'tag-memory', 'tag-hidden-gem'],
    status: 'published',
    publishedAt: new Date('2024-01-30T06:00:00Z'),
    engagement: { views: 298, likes: 42, unlocks: 28, comments: 15 }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting seed process...');

    // Clear existing data
    await User.deleteMany({});
    await Story.deleteMany({});
    await Location.deleteMany({});
    await Tag.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Hash passwords for users
    for (let user of seedUsers) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    // Insert seed data
    await User.insertMany(seedUsers);
    console.log('👥 Seeded users');

    await Location.insertMany(seedLocations);
    console.log('📍 Seeded locations');

    await Tag.insertMany(seedTags);
    console.log('🏷️ Seeded tags');

    await Story.insertMany(seedStories);
    console.log('📚 Seeded stories');

    // Update location stats
    for (let location of seedLocations) {
      const storyCount = seedStories.filter(story => story.location === location._id).length;
      if (storyCount > 0) {
        await Location.findByIdAndUpdate(location._id, {
          'stats.storiesCount': storyCount,
          'stats.lastStoryDate': new Date(),
          'stats.popularityScore': storyCount * 10
        });
      }
    }

    // Update tag usage stats
    for (let tag of seedTags) {
      const storyCount = seedStories.filter(story => 
        story.tags && story.tags.includes(tag._id)
      ).length;
      if (storyCount > 0) {
        await Tag.findByIdAndUpdate(tag._id, {
          'usage.totalStories': storyCount,
          'usage.activeStories': storyCount,
          'usage.popularityScore': storyCount * 10
        });
      }
    }

    console.log('✅ Seed data inserted successfully!');
    console.log(`
📊 SEED SUMMARY:
- 👥 ${seedUsers.length} users created
- 📍 ${seedLocations.length} locations added  
- 🏷️ ${seedTags.length} tags created
- 📚 ${seedStories.length} stories published

🎭 Demo Accounts:
- Admin: admin@storyswap.com / admin123
- Rita (Delhi): rita@example.com / test1234  
- Sam (Chennai): sam@example.com / test1234
- Aarav (Jaipur): aarav@example.com / test1234
- Priya (Mumbai): priya@example.com / test1234
- Arjun (Agra): arjun@example.com / test1234

🌟 Ready for national competition demo!
    `);

  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };