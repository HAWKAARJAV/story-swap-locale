import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, MessageCircle, Star, Sparkles, Map, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handleImageError, avatarPlaceholder } from "@/utils/imageUtils";

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    excerpt: string;
    location: string;
    author: {
      name: string;
      avatar?: string;
      badge?: string;
    };
    tags: string[];
    likes: number;
    comments: number;
    isLocked: boolean;
    isLiked: boolean;
    image?: string;
    emotion?: string;
    readTime?: string;
  };
  onSwapToUnlock?: () => void;
  onStoryClick?: () => void;
  variant?: 'default' | 'featured' | 'trending';
  className?: string;
}

const StoryCard = ({ 
  story, 
  onStoryClick, 
  variant = 'default',
  className = '' 
}: StoryCardProps) => {
  const [isLiked, setIsLiked] = useState(story.isLiked);
  const [likes, setLikes] = useState(story.likes);
  const [planningTrip, setPlanningTrip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handlePlanSimilarTrip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlanningTrip(true);
    
    try {
      const plannerUrl = `/plan?story=${encodeURIComponent(story.title)}&location=${encodeURIComponent(story.location)}&emotion=${encodeURIComponent(story.emotion || 'adventure')}`;
      window.open(plannerUrl, '_blank');
    } catch (error) {
      console.error('Error planning trip:', error);
    } finally {
      setPlanningTrip(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const emotions = {
      'adventure': 'from-red-500 to-orange-500',
      'peaceful': 'from-green-500 to-teal-500', 
      'cultural': 'from-purple-500 to-pink-500',
      'romantic': 'from-pink-500 to-rose-500',
      'spiritual': 'from-blue-500 to-indigo-500',
      'exciting': 'from-orange-500 to-yellow-500'
    };
    return emotions[emotion as keyof typeof emotions] || 'from-gray-500 to-gray-600';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4
      }
    }
  };

  const glowVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className={`story-card group relative overflow-hidden ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glassmorphism Background - Dark Semi-transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl" />
      
      {/* Glow Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
        variants={glowVariants}
        initial="rest"
        animate={isHovered ? "hover" : "rest"}
      />

      {/* Content Container */}
      <div className="relative z-10 p-6">
        {/* Story Image with Mirror Effect */}
        {story.image && (
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
            <motion.img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="rest"
              animate={isHovered ? "hover" : "rest"}
              onError={handleImageError}
            />
            
            {/* Mirror/Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Emotion Indicator */}
            {story.emotion && (
              <motion.div 
                className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-r ${getEmotionColor(story.emotion)} shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              />
            )}

            {/* Read Time Badge */}
            {story.readTime && (
              <motion.div 
                className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BookOpen className="w-3 h-3 inline mr-1" />
                {story.readTime}
              </motion.div>
            )}
          </div>
        )}

        {/* Author & Location */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarImage src={story.author.avatar || avatarPlaceholder} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {story.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-white">{story.author.name}</span>
                {story.author.badge && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center text-white/70 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {story.location}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-white group-hover:text-blue-300 transition-colors duration-200">
            {story.title}
          </h3>
          
          <p className="text-white/70 text-sm mb-4 line-clamp-3">
            {story.excerpt}
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {story.tags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Badge 
                variant="secondary" 
                className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-200"
              >
                {tag}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-400' : 'text-white/70'} hover:text-red-400 transition-colors duration-200`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.div>
              <span className="text-xs">{likes}</span>
            </motion.button>
            
            <motion.button
              className="flex items-center space-x-1 text-white/70 hover:text-blue-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{story.comments}</span>
            </motion.button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Plan Similar Trip Button */}
            <motion.button
              onClick={handlePlanSimilarTrip}
              disabled={planningTrip}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {planningTrip ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"
                  />
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span>{planningTrip ? 'Planning...' : 'Plan Trip'}</span>
            </motion.button>

            {/* Read Story Button */}
            <motion.button 
              onClick={onStoryClick}
              className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Story
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Hover Overlay for Featured Cards */}
      {variant === 'featured' && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default StoryCard;