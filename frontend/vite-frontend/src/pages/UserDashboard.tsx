import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  User, 
  Heart, 
  BookOpen, 
  Map, 
  Settings, 
  Trophy,
  Camera,
  Globe,
  Calendar,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Grid,
  List,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StoryCard from '@/components/StoryCard';

interface UserStats {
  totalStories: number;
  totalLikes: number;
  totalViews: number;
  countriesVisited: number;
  followersCount: number;
  followingCount: number;
}

interface Story {
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
  views: number;
  isLocked: boolean;
  isLiked: boolean;
  image?: string;
  emotion?: string;
  readTime?: string;
  publishedDate: string;
  status: 'published' | 'draft' | 'pending';
}

interface TravelItinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  budget: string;
  status: 'planning' | 'booked' | 'completed';
  image: string;
  activities: string[];
  startDate: string;
}

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'saved' | 'itineraries' | 'achievements'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'pending'>('all');
  
  const statsRef = useRef(null);
  const storiesRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const isStoriesInView = useInView(storiesRef, { once: true });

  // Mock user data
  const user = {
    id: '1',
    name: 'Adventure Andy',
    username: '@adventure_andy',
    email: 'andy@example.com',
    avatar: '/avatars/andy.jpg',
    bio: 'Professional mountaineer and travel photographer exploring the world\'s highest peaks. Sharing stories to inspire your next adventure.',
    location: 'Based in Colorado, USA',
    joinDate: '2023-01-15',
    verified: true
  };

  const userStats: UserStats = {
    totalStories: 24,
    totalLikes: 1847,
    totalViews: 12560,
    countriesVisited: 18,
    followersCount: 892,
    followingCount: 156
  };

  const userStories: Story[] = [
    {
      id: '1',
      title: 'Journey Through the Himalayas',
      excerpt: 'An epic adventure through the world\'s highest mountains, discovering hidden villages and ancient monasteries.',
      location: 'Nepal, Himalayas',
      author: user,
      tags: ['Adventure', 'Mountains', 'Culture'],
      likes: 342,
      comments: 89,
      views: 2847,
      isLocked: false,
      isLiked: false,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      emotion: 'adventure',
      readTime: '8 min read',
      publishedDate: '2024-03-15',
      status: 'published'
    },
    {
      id: '2',
      title: 'Camping Under the Northern Lights',
      excerpt: 'A magical night in Iceland where the aurora borealis painted the sky in impossible colors.',
      location: 'Reykjavik, Iceland',
      author: user,
      tags: ['Nature', 'Photography', 'Aurora'],
      likes: 567,
      comments: 92,
      views: 4231,
      isLocked: false,
      isLiked: true,
      image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&h=600&fit=crop',
      emotion: 'exciting',
      readTime: '6 min read',
      publishedDate: '2024-02-28',
      status: 'published'
    },
    {
      id: '3',
      title: 'Desert Solitude in Sahara',
      excerpt: 'Finding peace and perspective in the vast emptiness of the world\'s largest hot desert.',
      location: 'Sahara Desert, Morocco',
      author: user,
      tags: ['Desert', 'Solo Travel', 'Meditation'],
      likes: 234,
      comments: 45,
      views: 1892,
      isLocked: false,
      isLiked: false,
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      emotion: 'peaceful',
      readTime: '10 min read',
      publishedDate: '2024-01-20',
      status: 'draft'
    }
  ];

  const savedStories: Story[] = [
    {
      id: '4',
      title: 'Art and Architecture in Rome',
      excerpt: 'Exploring the eternal city through its magnificent art, architecture, and culinary delights.',
      location: 'Rome, Italy',
      author: { name: 'Culture Mike', avatar: '/avatars/mike.jpg', badge: 'verified' },
      tags: ['Culture', 'Art', 'Food'],
      likes: 445,
      comments: 123,
      views: 3421,
      isLocked: false,
      isLiked: true,
      image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=600&fit=crop',
      emotion: 'cultural',
      readTime: '12 min read',
      publishedDate: '2024-03-10',
      status: 'published'
    }
  ];

  const travelItineraries: TravelItinerary[] = [
    {
      id: '1',
      title: 'Japanese Cherry Blossom Adventure',
      destination: 'Tokyo, Kyoto, Osaka',
      duration: '14 days',
      budget: '$3,500',
      status: 'planning',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      activities: ['Temple visits', 'Hanami festivals', 'Traditional ryokan', 'Mount Fuji hike'],
      startDate: '2024-04-01'
    },
    {
      id: '2',
      title: 'Patagonia Wilderness Trek',
      destination: 'Torres del Paine, Chile',
      duration: '10 days',
      budget: '$2,800',
      status: 'booked',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      activities: ['W Circuit trek', 'Glacier viewing', 'Wildlife photography', 'Camping'],
      startDate: '2024-11-15'
    }
  ];

  const achievements = [
    { id: '1', title: 'First Story', description: 'Published your first travel story', icon: BookOpen, earned: true, date: '2023-01-20' },
    { id: '2', title: 'Explorer', description: 'Visited 10+ countries', icon: Globe, earned: true, date: '2023-06-15' },
    { id: '3', title: 'Storyteller', description: 'Reached 1000+ story views', icon: Eye, earned: true, date: '2023-08-10' },
    { id: '4', title: 'Community Favorite', description: 'Received 500+ likes', icon: Heart, earned: true, date: '2023-11-22' },
    { id: '5', title: 'Master Explorer', description: 'Visit 25+ countries', icon: Trophy, earned: false, date: null },
    { id: '6', title: 'Viral Story', description: 'Get 10,000+ views on a single story', icon: TrendingUp, earned: false, date: null }
  ];

  const filteredStories = userStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const slideVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const statsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const tabVariants = {
    inactive: { 
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.7)"
    },
    active: { 
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      color: "rgb(255, 255, 255)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center space-x-6"
            variants={slideVariants}
          >
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white/30">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {user.verified && (
                <motion.div
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Star className="w-4 h-4 text-white fill-current" />
                </motion.div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-blue-300 mb-1">{user.username}</p>
              <p className="text-white/70 max-w-md">{user.bio}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-white/60">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4 mt-6 lg:mt-0"
            variants={itemVariants}
          >
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
          {[
            { label: 'Stories', value: userStats.totalStories, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
            { label: 'Likes', value: userStats.totalLikes, icon: Heart, color: 'from-red-500 to-pink-500' },
            { label: 'Views', value: userStats.totalViews, icon: Eye, color: 'from-green-500 to-teal-500' },
            { label: 'Countries', value: userStats.countriesVisited, icon: Globe, color: 'from-purple-500 to-indigo-500' },
            { label: 'Followers', value: userStats.followersCount, icon: User, color: 'from-yellow-500 to-orange-500' },
            { label: 'Following', value: userStats.followingCount, icon: User, color: 'from-pink-500 to-rose-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
              variants={statsVariants}
              custom={index}
            >
              <div className="relative mx-auto w-12 h-12 mb-3">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-lg opacity-60`} />
                <div className={`relative bg-gradient-to-r ${stat.color} rounded-full w-full h-full flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <motion.div
                className="text-2xl font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={isStatsInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              >
                {stat.value.toLocaleString()}
              </motion.div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-wrap items-center justify-center mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'stories', label: 'My Stories', icon: BookOpen },
              { id: 'saved', label: 'Saved', icon: Heart },
              { id: 'itineraries', label: 'Itineraries', icon: Map },
              { id: 'achievements', label: 'Achievements', icon: Trophy }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all"
                variants={tabVariants}
                animate={activeTab === tab.id ? "active" : "inactive"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Published', item: 'Journey Through the Himalayas', time: '2 days ago', icon: BookOpen },
                      { action: 'Liked', item: 'Art and Architecture in Rome', time: '5 days ago', icon: Heart },
                      { action: 'Commented on', item: 'Sunset Meditation in Bali', time: '1 week ago', icon: MessageCircle },
                      { action: 'Saved', item: 'Northern Lights in Iceland', time: '2 weeks ago', icon: Heart }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">
                            <span className="font-medium">{activity.action}</span> {activity.item}
                          </p>
                          <p className="text-white/60 text-sm">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Performance This Month</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'New Followers', value: '+47', trend: '+12%', color: 'text-green-400' },
                        { label: 'Story Views', value: '2,340', trend: '+8%', color: 'text-green-400' },
                        { label: 'Engagement', value: '156', trend: '+23%', color: 'text-green-400' }
                      ].map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-white/80">{metric.label}</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">{metric.value}</div>
                            <div className={`text-sm ${metric.color}`}>{metric.trend}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Next Adventures</h3>
                    {travelItineraries.slice(0, 2).map((itinerary, index) => (
                      <motion.div
                        key={itinerary.id}
                        className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg mb-3 last:mb-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={itinerary.image}
                          alt={itinerary.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{itinerary.title}</h4>
                          <p className="text-white/60 text-xs">{itinerary.destination}</p>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${
                            itinerary.status === 'booked' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {itinerary.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div>
                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input
                        placeholder="Search your stories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 w-64"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="bg-white/10 border border-white/30 text-white rounded-lg px-4 py-2"
                    >
                      <option value="all">All Stories</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="p-2"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="p-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stories Grid/List */}
                <motion.div
                  ref={storiesRef}
                  className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                  variants={containerVariants}
                  initial="hidden"
                  animate={isStoriesInView ? "visible" : "hidden"}
                >
                  {filteredStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      variants={itemVariants}
                      custom={index}
                      className={viewMode === 'list' ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6' : ''}
                    >
                      {viewMode === 'grid' ? (
                        <StoryCard story={story} variant="default" />
                      ) : (
                        <div className="flex items-center space-x-6">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{story.title}</h3>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  story.status === 'published' ? 'bg-green-500/20 text-green-400' :
                                  story.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {story.status}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">{story.excerpt}</p>
                            <div className="flex items-center space-x-4 text-white/60 text-sm">
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {story.likes}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {story.views}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {story.readTime}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/50" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Saved Stories Tab */}
            {activeTab === 'saved' && (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {savedStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <StoryCard story={story} variant="default" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Itineraries Tab */}
            {activeTab === 'itineraries' && (
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {travelItineraries.map((itinerary, index) => (
                  <motion.div
                    key={itinerary.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={itinerary.image}
                        alt={itinerary.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge
                          className={`mb-2 ${
                            itinerary.status === 'booked' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                            itinerary.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                          }`}
                        >
                          {itinerary.status}
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-1">{itinerary.title}</h3>
                        <p className="text-white/80">{itinerary.destination}</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-white/60 text-sm">Duration</span>
                          <p className="text-white font-medium">{itinerary.duration}</p>
                        </div>
                        <div>
                          <span className="text-white/60 text-sm">Budget</span>
                          <p className="text-white font-medium">{itinerary.budget}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-white/60 text-sm block mb-2">Activities</span>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.activities.slice(0, 3).map((activity, actIndex) => (
                            <Badge key={actIndex} variant="secondary" className="text-xs bg-white/10 text-white">
                              {activity}
                            </Badge>
                          ))}
                          {itinerary.activities.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-white/10 text-white">
                              +{itinerary.activities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center ${
                      achievement.earned ? '' : 'opacity-50'
                    }`}
                    variants={itemVariants}
                    custom={index}
                    whileHover={achievement.earned ? { scale: 1.02 } : {}}
                  >
                    <div className={`relative mx-auto w-16 h-16 mb-4 ${
                      achievement.earned ? 'animate-pulse' : ''
                    }`}>
                      <div className={`absolute inset-0 rounded-full blur-lg opacity-60 ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gray-500'
                      }`} />
                      <div className={`relative rounded-full w-full h-full flex items-center justify-center ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gray-500'
                      }`}>
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{achievement.description}</p>
                    
                    {achievement.earned ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        Earned {achievement.date && new Date(achievement.date).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                        Not Earned
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDashboard;