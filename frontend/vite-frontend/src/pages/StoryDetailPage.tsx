import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  User, 
  Camera,
  Clock,
  Eye,
  Bookmark,
  ThumbsUp,
  Star,
  ArrowLeft,
  Map as MapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StoryCard from '@/components/StoryCard';

interface StoryDetailProps {
  storyId?: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface RelatedStory {
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
}

const StoryDetailPage: React.FC<StoryDetailProps> = ({ storyId = '1' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(342);
  const [showMap, setShowMap] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedStories, setRelatedStories] = useState<RelatedStory[]>([]);
  const [newComment, setNewComment] = useState('');

  // Mock story data
  const story = {
    id: storyId,
    title: 'Journey Through the Himalayas',
    content: `The morning mist clung to the mountain peaks as we began our ascent toward Everest Base Camp. Each step forward felt like a meditation, the rhythmic crunch of snow beneath our boots creating a symphony with the wind that whispered through the valleys.

What struck me most wasn't the grandeur of the mountains—though they were breathtaking—but the warmth of the people we encountered along the way. In a small tea house at 4,200 meters, an elderly Sherpa woman named Pemba shared her homemade dal bhat with us, refusing any payment. Her weathered hands told stories of countless seasons in these heights, and her smile was brighter than the sun reflecting off the glaciers.

The landscape changed dramatically as we climbed higher. The lush rhododendron forests gave way to barren, moonlike terrain where each breath required conscious effort. Prayer flags fluttered in the thin air, carrying wishes and hopes across impossible distances.

On day seven, as we reached Kala Patthar at sunrise, the entire Himalayan range unveiled itself in golden light. Everest, Lhotse, and Nuptse stood like ancient guardians, reminding us of our place in the vast tapestry of existence. In that moment, surrounded by the world's highest peaks, I felt simultaneously insignificant and infinitely connected to everything around me.

The descent was bittersweet. While my legs welcomed the thicker air and easier breathing, my heart was reluctant to leave this sacred space where time seemed suspended and every moment felt precious.`,
    location: 'Everest Base Camp, Nepal',
    author: {
      name: 'Adventure Andy',
      avatar: '/avatars/andy.jpg',
      badge: 'verified',
      bio: 'Professional mountaineer and travel photographer with 15+ years exploring the world\'s highest peaks.'
    },
    tags: ['Adventure', 'Mountains', 'Hiking', 'Nepal', 'Photography', 'Solo Travel'],
    publishedDate: '2024-03-15',
    readTime: '8 min read',
    views: 2847,
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1200&h=800&fit=crop'
    ],
    coordinates: {
      lat: 27.9881,
      lng: 86.9250
    },
    emotion: 'adventure'
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: { name: 'Sarah Explorer', avatar: '/avatars/sarah.jpg' },
      content: 'This is absolutely incredible! Your description of the sunrise at Kala Patthar gave me chills. Adding this to my bucket list!',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2',
      author: { name: 'Mountain Mike', avatar: '/avatars/mike.jpg' },
      content: 'I did this trek last year and your story brought back all the memories. The part about Pemba really resonated with me - the kindness of the Sherpa people is truly remarkable.',
      timestamp: '1 day ago',
      likes: 8
    }
  ];

  const mockRelatedStories: RelatedStory[] = [
    {
      id: '2',
      title: 'Annapurna Circuit: A Journey of Self-Discovery',
      excerpt: 'Twenty-one days of trekking through diverse landscapes, from subtropical forests to high alpine deserts.',
      location: 'Annapurna, Nepal',
      author: { name: 'Trek Master', avatar: '/avatars/trek.jpg' },
      tags: ['Adventure', 'Mountains', 'Nepal'],
      likes: 234,
      comments: 56,
      isLocked: false,
      isLiked: false,
      image: 'https://images.unsplash.com/photo-1544967882-b35ba61b7e4a?w=800&h=600&fit=crop',
      emotion: 'adventure',
      readTime: '12 min read'
    },
    {
      id: '3',
      title: 'Spiritual Awakening in the Monasteries of Ladakh',
      excerpt: 'Finding peace and enlightenment in the ancient Buddhist monasteries of the Himalayas.',
      location: 'Ladakh, India',
      author: { name: 'Zen Traveler', avatar: '/avatars/zen.jpg' },
      tags: ['Spiritual', 'Culture', 'India'],
      likes: 189,
      comments: 34,
      isLocked: false,
      isLiked: true,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      emotion: 'spiritual',
      readTime: '6 min read'
    }
  ];

  useEffect(() => {
    setComments(mockComments);
    setRelatedStories(mockRelatedStories);
  }, []);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: 'You', avatar: '/avatars/user.jpg' },
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8 }
    }
  };

  const flipVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { 
      rotateY: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    },
    hover: {
      rotateY: 5,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 p-2 rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Button>
        </motion.div>

        {/* Hero Image Gallery */}
        <motion.div
          variants={imageVariants}
          className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="aspect-[16/9] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={story.images[activeImageIndex]}
                alt={story.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            {/* Image Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {story.images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    {story.emotion}
                  </Badge>
                  <span className="text-white/80 text-sm">{story.readTime}</span>
                  <span className="text-white/80 text-sm">•</span>
                  <span className="text-white/80 text-sm flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {story.views.toLocaleString()} views
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {story.title}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-white/30">
                      <AvatarImage src={story.author.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {story.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{story.author.name}</span>
                        {story.author.badge && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center text-white/70 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-white/70 text-sm">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(story.publishedDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  variants={pulseVariants}
                  animate={isLiked ? "pulse" : ""}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likes}</span>
                </motion.button>

                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length}</span>
                </motion.button>

                <motion.button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isSaved 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>Save</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-full hover:bg-blue-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapIcon className="w-5 h-5" />
                  <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
                </motion.button>

                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Interactive Map */}
            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 300, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                      <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                      <p className="text-white/70">
                        Location: {story.location}
                      </p>
                      <p className="text-white/70 text-sm mt-1">
                        Coordinates: {story.coordinates.lat}°N, {story.coordinates.lng}°E
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Content */}
            <motion.div
              variants={itemVariants}
              className="prose prose-lg prose-invert max-w-none mb-12"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <div className="text-white/90 leading-relaxed text-lg space-y-6">
                  {story.content.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {story.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors px-4 py-2 text-sm"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
                <div className="flex space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/avatars/user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this journey..."
                      className="w-full bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                    >
                      <div className="flex space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-white">{comment.author.name}</span>
                            <span className="text-white/50 text-sm">{comment.timestamp}</span>
                          </div>
                          <p className="text-white/90 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <motion.button
                              className="flex items-center space-x-1 text-white/70 hover:text-red-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">{comment.likes}</span>
                            </motion.button>
                            <button className="text-white/70 hover:text-white text-sm transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Info */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">About the Author</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-white/30">
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                    {story.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{story.author.name}</span>
                    {story.author.badge && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-white/70 text-sm">Adventure Photographer</p>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-4">
                {story.author.bio}
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Follow
              </Button>
            </motion.div>

            {/* Related Stories */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Related Stories</h3>
              <div className="space-y-6">
                {relatedStories.map((relatedStory, index) => (
                  <motion.div
                    key={relatedStory.id}
                    variants={flipVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="cursor-pointer"
                  >
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={relatedStory.image}
                          alt={relatedStory.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">
                          {relatedStory.title}
                        </h4>
                        <p className="text-white/60 text-xs mb-2 line-clamp-2">
                          {relatedStory.excerpt}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-white/50">
                          <span>{relatedStory.readTime}</span>
                          <span>•</span>
                          <span>{relatedStory.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryDetailPage;