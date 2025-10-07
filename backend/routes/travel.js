const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// AI Travel Planner endpoint
router.post('/plan', authenticate, async (req, res) => {
  try {
    const { userInput, currentMood, previousStories, userId } = req.body;

    // Demo AI trip planning logic
    const demoPlans = {
      'adventure': {
        destination: "Spiti Valley, Himachal Pradesh",
        itinerary: ["Key Monastery", "Kibber Village", "Chicham Bridge", "Pin Valley National Park"],
        vibe: "quiet adventure",
        quote: "Where the wind teaches you to listen again.",
        estimatedDuration: "7 days",
        bestSeason: "May-October",
        emotionalTone: "contemplative discovery",
        aiSuggestions: [
          "Pack warm clothes for high altitude",
          "Carry oxygen cans for emergency",
          "Book permits in advance"
        ]
      },
      'peaceful': {
        destination: "Coorg, Karnataka",
        itinerary: ["Coffee plantations", "Abbey Falls", "Dubare Elephant Camp", "Raja's Seat"],
        vibe: "serene retreat",
        quote: "In the hills, time moves like morning mist.",
        estimatedDuration: "4 days",
        bestSeason: "October-March",
        emotionalTone: "peaceful rejuvenation",
        aiSuggestions: [
          "Visit during coffee harvest season",
          "Try local homestays",
          "Book elephant interaction in advance"
        ]
      },
      'cultural': {
        destination: "Hampi, Karnataka",
        itinerary: ["Virupaksha Temple", "Vittala Temple", "Royal Enclosure", "Matanga Hill"],
        vibe: "historic immersion",
        quote: "Where stones whisper ancient stories.",
        estimatedDuration: "5 days",
        bestSeason: "November-February",
        emotionalTone: "mystical exploration",
        aiSuggestions: [
          "Hire a local guide for historical context",
          "Visit during sunrise from Matanga Hill",
          "Explore by bicycle for authentic experience"
        ]
      },
      'romantic': {
        destination: "Udaipur, Rajasthan",
        itinerary: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon Ki Bari"],
        vibe: "royal romance",
        quote: "Where love stories are written in marble and moonlight.",
        estimatedDuration: "4 days",
        bestSeason: "October-March",
        emotionalTone: "enchanted romance",
        aiSuggestions: [
          "Book lake view hotel for sunset views",
          "Take boat ride during golden hour",
          "Dine at rooftop restaurants"
        ]
      }
    };

    // Determine plan based on mood
    let selectedPlan = demoPlans.peaceful;
    
    if (currentMood && typeof currentMood === 'string') {
      const mood = currentMood.toLowerCase();
      if (mood.includes('adventure') || mood.includes('thrill')) {
        selectedPlan = demoPlans.adventure;
      } else if (mood.includes('culture') || mood.includes('history') || mood.includes('heritage')) {
        selectedPlan = demoPlans.cultural;
      } else if (mood.includes('romantic') || mood.includes('love') || mood.includes('couple')) {
        selectedPlan = demoPlans.romantic;
      }
    }

    // Add personalization based on previous stories
    if (previousStories && previousStories.length > 0) {
      const storyContext = previousStories.join(' ').toLowerCase();
      if (storyContext.includes('mountain') || storyContext.includes('trek')) {
        selectedPlan = demoPlans.adventure;
      } else if (storyContext.includes('temple') || storyContext.includes('heritage')) {
        selectedPlan = demoPlans.cultural;
      }
    }

    // Save trip plan to user profile (in a real app, you'd save to database)
    const tripPlan = {
      ...selectedPlan,
      userId,
      generatedAt: new Date(),
      context: {
        userInput,
        currentMood,
        previousStories
      }
    };

    res.json({
      success: true,
      data: tripPlan,
      message: "AI travel plan generated successfully"
    });

  } catch (error) {
    console.error('Error generating travel plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating travel plan',
      error: error.message
    });
  }
});

// Emotion analysis endpoint
router.post('/analyze-emotion', authenticate, async (req, res) => {
  try {
    const { storyContent, storyTitle } = req.body;

    if (!storyContent) {
      return res.status(400).json({
        success: false,
        message: 'Story content is required'
      });
    }

    // Demo emotion analysis logic
    const text = (storyTitle + ' ' + storyContent).toLowerCase();
    let emotion = 'peaceful';
    let moodScore = 5;

    // Simple keyword-based emotion detection
    if (text.includes('adventure') || text.includes('trek') || text.includes('climb') || text.includes('thrill')) {
      emotion = 'adventure';
      moodScore = 8;
    } else if (text.includes('temple') || text.includes('culture') || text.includes('heritage') || text.includes('history')) {
      emotion = 'cultural';
      moodScore = 7;
    } else if (text.includes('love') || text.includes('romantic') || text.includes('couple') || text.includes('honeymoon')) {
      emotion = 'romantic';
      moodScore = 9;
    } else if (text.includes('spiritual') || text.includes('meditation') || text.includes('peace') || text.includes('divine')) {
      emotion = 'spiritual';
      moodScore = 6;
    } else if (text.includes('exciting') || text.includes('fun') || text.includes('party') || text.includes('celebration')) {
      emotion = 'exciting';
      moodScore = 8;
    }

    // Generate AI suggestions based on emotion
    const suggestions = {
      'adventure': [
        'Plan a trekking expedition to similar terrain',
        'Explore adventure sports in mountain regions',
        'Consider multi-day hiking adventures'
      ],
      'cultural': [
        'Visit UNESCO World Heritage sites',
        'Explore ancient temples and monuments',
        'Take heritage walks with local guides'
      ],
      'romantic': [
        'Plan sunset dinners at scenic locations',
        'Book couple spa treatments',
        'Choose destinations with romantic ambiance'
      ],
      'spiritual': [
        'Visit meditation retreats and ashrams',
        'Explore sacred pilgrimage sites',
        'Join yoga and wellness programs'
      ],
      'peaceful': [
        'Choose hill stations and nature retreats',
        'Plan quiet getaways with minimal crowds',
        'Focus on wellness and relaxation'
      ],
      'exciting': [
        'Explore vibrant cities and nightlife',
        'Try local festivals and events',
        'Book adventure activities and tours'
      ]
    };

    res.json({
      success: true,
      data: {
        emotion,
        moodScore,
        confidence: 0.85,
        aiSuggestions: suggestions[emotion] || suggestions.peaceful,
        keywords: text.split(' ').filter(word => word.length > 4).slice(0, 10)
      },
      message: "Emotion analysis completed successfully"
    });

  } catch (error) {
    console.error('Error analyzing emotion:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing emotion',
      error: error.message
    });
  }
});

// Get user's travel context and history
router.get('/user-context', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // In a real app, fetch from database
    // For demo, return mock data based on user
    const mockUserContext = {
      'hawk@example.com': {
        current: 'adventurous exploration',
        previousStories: ['Mountain trekking in Ladakh', 'Desert camping in Rajasthan'],
        preferences: ['mountains', 'adventure', 'remote locations'],
        lastTripPlan: {
          destination: 'Spiti Valley',
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        }
      },
      'aarjav@example.com': {
        current: 'cultural discovery',
        previousStories: ['Street food tour in Mumbai', 'Heritage walk in Jaipur'],
        preferences: ['culture', 'food', 'history'],
        lastTripPlan: {
          destination: 'Hampi',
          generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      }
    };

    const userEmail = req.user.email;
    const context = mockUserContext[userEmail] || {
      current: 'peaceful retreat',
      previousStories: ['Beach sunset in Goa', 'Hill station in Munnar'],
      preferences: ['nature', 'relaxation', 'scenic beauty'],
      lastTripPlan: null
    };

    res.json({
      success: true,
      data: context,
      message: "User travel context retrieved successfully"
    });

  } catch (error) {
    console.error('Error fetching user context:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user context',
      error: error.message
    });
  }
});

// Save trip plan
router.post('/save-plan', authenticate, async (req, res) => {
  try {
    const { tripPlan } = req.body;
    const userId = req.user.id;

    // In a real app, save to database
    const savedPlan = {
      id: Date.now().toString(),
      userId,
      ...tripPlan,
      savedAt: new Date(),
      status: 'saved'
    };

    res.json({
      success: true,
      data: savedPlan,
      message: "Trip plan saved successfully"
    });

  } catch (error) {
    console.error('Error saving trip plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving trip plan',
      error: error.message
    });
  }
});

module.exports = router;