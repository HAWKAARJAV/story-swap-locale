'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  TrendingUp,
  Globe,
  Heart,
  BookOpen
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import DynamicBackground, { useUserLocation } from '@/components/ui/DynamicBackground';
import StoryCard from '@/components/stories/StoryCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStoriesStore } from '@/stores/stories';
import { useAuthStore } from '@/stores/auth';
import { SearchFilters } from '@/types';

const filterTabs = [
  { id: 'newest', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
  { id: 'all', label: 'All Stories', icon: Globe },
];

const popularTags = [
  'Love', 'Mystery', 'Adventure', 'History', 'Culture', 'Food', 
  'Festival', 'Family', 'Friendship', 'Dreams'
];

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { city, updateCity } = useUserLocation();
  const { isAuthenticated } = useAuthStore();
  const { 
    stories, 
    loading, 
    error, 
    fetchStories, 
    setFilters,
    loadMore,
    pagination 
  } = useStoriesStore();

  useEffect(() => {
    const filters: SearchFilters = {
      sortBy: activeFilter as any,
      query: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      location: activeFilter === 'nearby' ? { city } : undefined,
    };
    
    setFilters(filters);
    fetchStories(filters);
  }, [activeFilter, searchQuery, selectedTags, city, fetchStories, setFilters]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Header */}
      <div className="pt-20 pb-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Discover Stories from{' '}
              <span className="text-gradient capitalize">{city}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
              Explore fascinating tales from your local community and beyond. 
              {!isAuthenticated && ' Join to unlock exclusive stories and share your own experiences.'}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search stories, authors, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  className="pl-12 py-4 text-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-4"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === tab.id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-100 text-primary-700 border border-primary-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Change Location
                </h3>
                <select
                  value={city}
                  onChange={(e) => updateCity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="chennai">Chennai</option>
                  <option value="jaipur">Jaipur</option>
                  <option value="agra">Agra</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && stories.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchStories()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No stories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            {isAuthenticated && (
              <Button href="/create" variant="gradient">
                Share Your Story
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stories.map((story) => (
              <motion.div key={story._id} variants={itemVariants}>
                <StoryCard 
                  story={story}
                  onLike={(id) => console.log('Liked story:', id)}
                  onComment={(id) => console.log('Comment on story:', id)}
                  onShare={(id) => console.log('Share story:', id)}
                  onUnlock={(id) => console.log('Unlock story:', id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={loadMore}
              isLoading={loading}
              variant="outline"
              size="lg"
            >
              Load More Stories
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action for Unauthenticated Users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join our community of storytellers and unlock exclusive content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/register"
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Join Story Swap
                </Button>
                <Button
                  href="/login"
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}