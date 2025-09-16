'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPin, 
  BookOpen, 
  Users, 
  Sparkles, 
  ArrowRight,
  Globe,
  Heart,
  Star
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { useAuthStore } from '@/stores/auth';

const cities = [
  { name: 'Delhi', stories: 1247, gradient: 'from-purple-400 to-pink-400' },
  { name: 'Mumbai', stories: 892, gradient: 'from-pink-400 to-red-400' },
  { name: 'Chennai', stories: 634, gradient: 'from-blue-400 to-cyan-400' },
  { name: 'Jaipur', stories: 456, gradient: 'from-yellow-400 to-orange-400' },
  { name: 'Agra', stories: 321, gradient: 'from-green-400 to-blue-400' },
];

const features = [
  {
    icon: BookOpen,
    title: "Discover Local Stories",
    description: "Uncover fascinating tales from your neighborhood and beyond"
  },
  {
    icon: Users,
    title: "Story Swapping",
    description: "Share your story to unlock others' experiences"
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description: "Stories mapped to real places you can visit"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Intelligent translation and personalized recommendations"
  }
];

const stats = [
  { number: "10K+", label: "Stories Shared" },
  { number: "5K+", label: "Active Users" },
  { number: "25+", label: "Cities" },
  { number: "95%", label: "User Satisfaction" }
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              className="text-5xl md:text-7xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Stories from
              <br />
              <span className="text-gradient">Your City</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover fascinating local tales, share your own experiences, and unlock
              stories through our unique swap-to-read system.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Link
                  href="/discover"
                  className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center gap-2 hover:gap-3"
                >
                  Discover Stories
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center gap-2 hover:gap-3"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/discover"
                    className="px-8 py-4 border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Explore Stories
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* City Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                className="glass backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 group"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.8 + index * 0.1}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${city.gradient} rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{city.name}</h3>
                <p className="text-sm text-gray-400">{city.stories} stories</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Why Choose <span className="text-gradient">Story Swap</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience storytelling like never before with our innovative platform
              designed for the modern storyteller.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="glass backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass backdrop-blur-xl border border-white/10 rounded-2xl p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of storytellers and start discovering amazing tales from your city today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <>
                  <Link
                    href="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
                  >
                    Join Story Swap
                    <Heart className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    href="/login"
                    className="px-8 py-4 border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-display font-bold text-white">Story Swap</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Story Swap. Connecting communities through stories.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
