'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Clock, 
  Lock,
  Unlock,
  User,
  BookOpen,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { StoryCardProps } from '@/types';
import { formatRelativeTime, calculateReadingTime, formatNumber } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useStoriesStore } from '@/stores/stories';

export default function StoryCard({ 
  story, 
  variant = 'default',
  showAuthor = true,
  showLocation = true,
  showStats = true,
  onLike,
  onComment,
  onShare,
  onUnlock
}: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const { user } = useAuthStore();
  const { likeStory, unlikeStory } = useStoriesStore();

  const handleLike = async () => {
    if (!user) return;
    
    setIsLiked(!isLiked);
    try {
      if (isLiked) {
        await unlikeStory(story._id);
      } else {
        await likeStory(story._id);
      }
      onLike?.(story._id);
    } catch (error) {
      setIsLiked(!isLiked); // Revert on error
    }
  };

  const readingTime = calculateReadingTime(story.content);
  const isLikedByUser = user ? story.likedBy.includes(user._id) : false;
  
  const cardVariants = {
    default: "bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700",
    compact: "bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow border border-gray-100 dark:border-gray-700",
    featured: "bg-gradient-to-br from-primary-50/30 to-accent-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl border border-primary-100 dark:border-gray-600"
  };

  const sizeVariants = {
    default: "p-6",
    compact: "p-4", 
    featured: "p-8"
  };

  return (
    <motion.div
      className={`story-card ${cardVariants[variant]} ${sizeVariants[variant]} cursor-pointer relative overflow-hidden group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-800" />
      </div>

      {/* Locked Overlay */}
      {story.isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <div className="text-center text-white">
            <Lock className="w-12 h-12 mx-auto mb-4 text-accent-400" />
            <p className="font-semibold mb-2">Story Locked</p>
            <p className="text-sm text-gray-300 mb-4">{story.lockReason || 'Share a story to unlock'}</p>
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUnlock?.(story._id)}
            >
              <Unlock className="w-4 h-4 inline mr-2" />
              Unlock Story
            </motion.button>
          </div>
        </div>
      )}

      {/* Header */}
      {showAuthor && (
        <div className="flex items-center justify-between mb-4 relative z-20">
          <Link href={`/profile/${story.author.username}`} className="flex items-center gap-3 group">
            <div className="relative">
              {story.author.avatar ? (
                <img 
                  src={story.author.avatar} 
                  alt={story.author.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-700"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              
              {/* Online Status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {story.author.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                @{story.author.username}
              </p>
            </div>
          </Link>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Story Content */}
      <div className="relative z-20">
        <Link href={`/stories/${story._id}`}>
          <motion.h2 
            className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            layoutId={`title-${story._id}`}
          >
            {story.title}
          </motion.h2>
        </Link>

        <div className="relative">
          <motion.p 
            className={`text-gray-700 dark:text-gray-300 leading-relaxed ${showFullContent ? '' : 'line-clamp-3'}`}
            initial={false}
            animate={{ height: showFullContent ? 'auto' : undefined }}
          >
            {story.summary || story.content}
          </motion.p>
          
          {(story.summary || story.content.length > 150) && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mt-2"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {story.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
              >
                #{tag.name}
              </span>
            ))}
            {story.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                +{story.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 space-y-4 relative z-20">
        {/* Location & Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {showLocation && story.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{story.location.name}, {story.location.city}</span>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            <span>{formatRelativeTime(story.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showStats && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-6">
              {/* Like Button */}
              <motion.button
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                  isLikedByUser 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                onClick={handleLike}
                whileTap={{ scale: 0.95 }}
                disabled={!user}
              >
                <motion.div
                  animate={isLikedByUser ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 ${isLikedByUser ? 'fill-current' : ''}`} />
                </motion.div>
                <span className="text-sm font-medium">{formatNumber(story.likes)}</span>
              </motion.button>

              {/* Comment Button */}
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                onClick={() => onComment?.(story._id)}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{formatNumber(story.comments?.length || 0)}</span>
              </button>

              {/* Views */}
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">{formatNumber(story.views)}</span>
              </div>
            </div>

            {/* Share Button */}
            <button
              className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all duration-200"
              onClick={() => onShare?.(story._id)}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Hover Effects */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Language Badge */}
      {story.language && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/20 backdrop-blur-sm text-white text-xs font-medium rounded-full z-30">
          {story.language.toUpperCase()}
        </div>
      )}
    </motion.div>
  );
}