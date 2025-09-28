import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// Ensure HelmetProvider is added to App.tsx for Helmet to work properly
import { MapPin, Book, Globe, Users, TrendingUp, Shield } from 'lucide-react';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About StorySwap Locale | Share Stories from Around the World</title>
        <meta name="description" content="Learn about StorySwap Locale, the platform connecting travelers and locals through authentic stories tied to specific locations around the world." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                Our Story
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Connecting travelers and locals through authentic stories tied to specific locations around the world.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-700 mb-6">
                  StorySwap Locale was born from a simple idea: every place has a story, and every story has a place. 
                  We believe that the most authentic way to experience a location is through the stories of those who've been there.
                </p>
                <p className="text-lg text-slate-700">
                  Our platform enables travelers to discover hidden gems, local insights, and personal experiences tied to specific 
                  locations around the world, creating a global community of storytellers and explorers.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg"
              >
                <div className="flex flex-col space-y-6">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Location-Based Stories</h3>
                      <p className="text-slate-700">Every story is tied to a specific location, creating a global map of experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Community Connection</h3>
                      <p className="text-slate-700">Building bridges between travelers and locals through shared experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Global Perspective</h3>
                      <p className="text-slate-700">Discover diverse perspectives from storytellers around the world.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How StorySwap Locale Works</h2>
              <p className="text-lg text-slate-700 max-w-3xl mx-auto">
                Our platform makes it easy to discover and share location-based stories from around the world.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Discover Stories</h3>
                <p className="text-slate-700">
                  Explore our interactive map to find stories from specific locations or browse by categories and trending content.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <Book className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Share Your Story</h3>
                <p className="text-slate-700">
                  Create and publish your own stories tied to specific locations, complete with photos, text, and geolocation data.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Connect & Engage</h3>
                <p className="text-slate-700">
                  Interact with other users, follow favorite storytellers, and build connections with travelers and locals worldwide.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* For Investors Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">For Investors</h2>
              <p className="text-lg max-w-3xl mx-auto opacity-90">
                StorySwap Locale represents a unique opportunity in the travel tech and social media space.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4">Market Opportunity</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Targeting the $800B+ global travel market with a unique content-first approach</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Filling the gap between travel review sites and social media platforms</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Leveraging the growing demand for authentic, local experiences</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-4">Our Advantage</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Proprietary location-based content discovery algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Scalable infrastructure optimized for global performance</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multiple revenue streams: premium subscriptions, partnerships, and targeted advertising</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <a 
                href="/contact" 
                className="inline-block bg-white text-indigo-600 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-50 transition-all duration-200"
              >
                Connect With Our Team
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;