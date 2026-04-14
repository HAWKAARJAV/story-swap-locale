import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedStories from "../components/FeaturedStories";
import PopularDestinations from "../components/PopularDestinations";
import { ArrowRight, MapPin, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="pt-16">
      <HeroSection />
      <PopularDestinations />
      <HowItWorks />
      <FeaturedStories />

      {/* AI Planning CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm text-primary text-sm font-semibold mb-8 shadow-lg">
              <Sparkles className="w-4 h-4" />
              AI-POWERED TRIP PLANNING
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Plan Your Next Adventure?
            </h2>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Use our AI travel planner to discover personalized destinations based on your mood,
              preferences, and past stories. Get unique itineraries crafted just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/plan')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-glow text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Start Planning with AI
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/explore')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                Browse Stories
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join Our Global Community
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Connect with travelers worldwide, share your stories, and discover hidden gems from locals.
            </p>

            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                LocaleLens
              </h3>
              <p className="text-white/60 mb-6 max-w-md">
                Connecting travelers through authentic stories and AI-powered trip planning.
                Discover the world through local eyes.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">Instagram</a>
                <a href="#" className="text-white/60 hover:text-primary transition-colors">Facebook</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/explore" className="hover:text-primary transition-colors">Stories</Link></li>
                <li><Link to="/plan" className="hover:text-primary transition-colors">Plan Trip</Link></li>
                <li><Link to="/submit" className="hover:text-primary transition-colors">Share Story</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact-us" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by the LocaleLens Team
            </p>
            <p className="text-white/40 text-sm">© 2026 LocaleLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
