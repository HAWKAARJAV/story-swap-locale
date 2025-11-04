import StoryCard from "./StoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import jazzClubImage from "@/assets/jazz-club.jpg";
import parisCafeImage from "@/assets/paris-cafe.jpg";
import communityFoodImage from "@/assets/community-food.jpg";
import { storyImages } from "@/utils/imageUtils";

const FeaturedStories = () => {
  const navigate = useNavigate();
  const featuredStories = [
    {
      id: "1",
      title: "The Secret Jazz Club Behind the Bookstore",
      excerpt: "Every Thursday night, a hidden door opens in the back of Chennai's oldest bookstore, revealing a world of underground jazz that's been thriving since the 1970s...",
      fullContent: "Every Thursday night, a hidden door opens in the back of Chennai's oldest bookstore, revealing a world of underground jazz that's been thriving since the 1970s. As I pushed through the dusty volumes of Tamil literature, I heard the faint sound of a saxophone bleeding through the walls.\n\nThe owner, Mr. Krishnan, noticed my curiosity and with a knowing smile, gestured toward a bookshelf marked 'Philosophy.' As the shelf swung open, the music grew louder, and I found myself descending into a basement that time forgot.\n\nThe room was dimly lit with warm amber lights, filled with mismatched furniture and walls covered in photographs of legendary musicians. Local artists gathered here every week, keeping alive a tradition that started when Chennai's jazz scene was forced underground during the conservative cultural movements of the 80s.\n\nWhat struck me most wasn't just the music, but the diversity of the crowd. Young software engineers sat next to elderly classical musicians, all united by their love for improvisation and soul. This hidden sanctuary proves that true culture finds a way to survive, even when it has to hide behind books.",
      location: "Chennai, India",
      author: {
        name: "Priya Sharma",
        badge: "Local Guide"
      },
      tags: ["Music", "Hidden Gems", "Culture"],
      likes: 47,
      comments: 12,
      isLocked: false,
      isLiked: false,
      image: jazzClubImage
    },
    {
      id: "2",
      title: "Where Hemingway Wrote His Last Letter",
      excerpt: "In a quiet corner of this Paris café, Ernest Hemingway penned what would become his final correspondence. The owner still keeps the table exactly as it was...",
      fullContent: "In a quiet corner of this Paris café, Ernest Hemingway penned what would become his final correspondence. The owner still keeps the table exactly as it was, complete with the ring stains from his whiskey glass and the cigarette burn that marked his favorite spot.\n\nCafé de la Paix may be famous among tourists, but this smaller establishment on Rue des Martyrs holds a more intimate piece of literary history. Marie-Claire, the third-generation owner, showed me the exact table where Hemingway spent his final weeks in Paris, struggling with what he knew would be his last piece of writing.\n\nThe letter, addressed to his friend and fellow writer A.E. Hotchner, was never sent. Instead, it remained in his notebook, discovered years later by scholars. In it, he reflected on the weight of words and the responsibility of storytelling – themes that had defined his entire career.\n\nSitting at that same table today, watching the morning light filter through century-old windows, I could almost feel the presence of literary giants who once filled this space with their dreams, doubts, and desperate need to capture truth on paper. The café serves the same bitter coffee and warm croissants, maintaining a connection to a time when Paris was the beating heart of the artistic world.",
      location: "Paris, France",
      author: {
        name: "Marcus Chen",
        badge: "Story Master"
      },
      tags: ["Literary", "History", "Café Culture"],
      likes: 89,
      comments: 24,
      isLocked: false,
      isLiked: false,
      image: parisCafeImage
    },
    {
      id: "3",
      title: "The Grandmother's Recipe That United a Neighborhood",
      excerpt: "When Mrs. Rodriguez started sharing her tamales during the pandemic, she had no idea it would bring together a community that had been divided for years...",
      fullContent: "When Mrs. Rodriguez started sharing her tamales during the pandemic, she had no idea it would bring together a community that had been divided for years. What began as a simple act of kindness – leaving extra food on her doorstep for struggling neighbors – evolved into something magical.\n\nThe recipe had been passed down through four generations of women in her family, each adding their own secret ingredient. Her great-grandmother's masa technique, her grandmother's spice blend, her mother's filling innovation, and now her own touch – a sprinkle of hope in every batch.\n\nAs word spread through the apartment complex, people from different floors began talking for the first time. The elderly man from 3B who nobody ever spoke to turned out to be a former chef with stories that could fill a cookbook. The young single mother from 2A started trading childcare with other families in exchange for cooking lessons.\n\nBy the end of lockdown, Mrs. Rodriguez's weekly tamale distribution had become a community tradition. Neighbors organized a rotating schedule where each family would share their cultural dishes, turning their diverse apartment building into a celebration of unity through food. Sometimes the smallest gestures create the most profound connections.\n\nToday, that same building hosts monthly cultural dinners, and the recipe that started it all is now written in seven different languages, shared freely with anyone who promises to pass it forward.",
      location: "Mexico City, Mexico",
      author: {
        name: "Sofia Martinez"
      },
      tags: ["Food", "Community", "Heartwarming"],
      likes: 156,
      comments: 33,
      isLocked: false,
      isLiked: true,
      image: communityFoodImage
    },
    {
      id: "4",
      title: "The Night Market Musician Who Changed My Life",
      excerpt: "His guitar case was held together with duct tape, and his voice cracked from years of singing in the rain, but somehow his music reached depths of my soul I didn't know existed...",
      fullContent: "His guitar case was held together with duct tape, and his voice cracked from years of singing in the rain, but somehow his music reached depths of my soul I didn't know existed. I was having the worst day of my career – laid off, broke, and questioning every life choice that led me to that moment.\n\nThen I heard him.\n\nHidden between food stalls selling pad thai and mango sticky rice, this weathered musician was performing for anyone who would listen. His repertoire ranged from Johnny Cash covers to traditional Thai folk songs, each one delivered with the kind of authenticity that can't be taught.\n\nBetween songs, he shared pieces of his story. A former lawyer who lost everything in the 2008 financial crisis, he found solace in music and never looked back. 'Money comes and goes,' he told the small crowd, 'but the ability to touch someone's heart with a song – that's wealth that compounds.'\n\nThat night, I learned that sometimes rock bottom becomes the solid foundation on which you rebuild your life. His fearless vulnerability in sharing both his music and his struggles showed me that there's power in embracing uncertainty rather than fighting it.\n\nI left that market with empty pockets but a full heart, and somehow knew that my own setback was just a setup for something better. Six months later, I started my own business. That musician's courage to start over inspired me to do the same.",
      location: "Bangkok, Thailand",
      author: {
        name: "David Kim"
      },
      tags: ["Music", "Inspiration", "Life Lessons"],
      likes: 203,
      comments: 45,
      isLocked: false,
      isLiked: false,
      image: storyImages.miami
    }
  ];

  const handleSwapToUnlock = () => {
    // This would trigger the story submission flow
    console.log("Opening story submission...");
  };

  const handleStoryClick = (story: any) => {
    // Navigate to story detail page with story data
    const storyData = encodeURIComponent(JSON.stringify(story));
    navigate(`/story-detail?data=${storyData}`);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-800/20 to-blue-900/20 animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <motion.h2 
            className="text-5xl font-bold mb-6" 
            style={{ color: 'hsl(215, 28%, 5%)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Stories in Motion
          </motion.h2>
          <motion.p 
            className="text-xl max-w-4xl mx-auto leading-relaxed" 
            style={{ color: 'hsl(215, 25%, 15%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore authentic experiences from travelers and locals around the world. 
            Each story unlocks a new perspective and reveals the hidden magic of extraordinary places.
          </motion.p>
        </div>

        {/* Glowing Glass Container with Animated Cards */}
        <motion.div 
          className="relative p-8 md:p-12 rounded-3xl overflow-hidden mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(255,255,255,0.1)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none" style={{
            background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
            animation: 'borderGlow 3s ease-in-out infinite'
          }} />

          {/* Floating Cards Animation */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            animate={{ 
              y: [0, -15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "easeInOut"
            }}
          >
            {featuredStories.slice(0, 3).map((story, index) => (
              <motion.div 
                key={story.id}
                className="transform hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <StoryCard 
                  story={story} 
                  onSwapToUnlock={handleSwapToUnlock}
                  onStoryClick={() => handleStoryClick(story)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Static Cards Below */}
          <div className="grid grid-cols-1 mt-12">
            {featuredStories.slice(3).map((story, index) => (
              <motion.div 
                key={story.id}
                className="mb-6 last:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              >
                <StoryCard 
                  story={story} 
                  onSwapToUnlock={handleSwapToUnlock}
                  onStoryClick={() => handleStoryClick(story)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="btn-magnetic bg-gradient-to-r from-primary via-primary-glow to-accent text-white text-lg px-12 py-5 h-auto rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all duration-500 group"
            onClick={() => navigate('/explore')}
          >
            Explore All Stories
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;