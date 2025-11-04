import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedStories from "../components/FeaturedStories";
import { Star, ArrowRight, MapPin, Mail, Phone, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <main className="pt-16">
      <HeroSection />
      <HowItWorks />
      <FeaturedStories />
      
      {/* CTA Section */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 text-secondary text-sm font-semibold mb-8">
            <span className="font-heading tracking-wider">JOIN OUR COMMUNITY</span>
          </div>
          
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-8 leading-tight text-white">
            Ready to Share 
            <span className="text-primary"> Your Story?</span>
          </h2>
          
          <p className="font-body text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of storytellers building the world's most authentic travel and local discovery platform. 
            Connect with travelers and locals around the globe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button className="btn-magnetic bg-gradient-to-r from-primary via-primary-glow to-accent text-white font-bold text-xl py-5 px-14 rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all duration-500 group">
              <span className="flex items-center">
                <Star className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                Start Your Journey
              </span>
            </button>
            <button className="btn-magnetic glass-enhanced border-2 border-white/50 text-white hover:bg-white hover:text-secondary font-bold text-xl py-5 px-14 rounded-2xl transition-all duration-500 group">
              <span className="flex items-center">
                Learn More
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Animations */}
      <footer className="text-white py-20 relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, hsl(215, 28%, 10%) 0%, hsl(215, 28%, 15%) 100%)'
      }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="floating absolute top-10 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
          <div className="floating absolute bottom-10 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl" style={{ animationDelay: '-3s' }} />
          <div className="floating absolute top-1/2 left-1/3 w-24 h-24 bg-primary-glow/30 rounded-full blur-2xl" style={{ animationDelay: '-6s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div 
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Story Swap
              </motion.h3>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Connecting the world through authentic local stories and shared experiences. 
                Discover hidden gems and create meaningful connections through storytelling.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <motion.div 
                  className="flex items-center text-white/70 hover:text-primary transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>San Francisco, CA</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-white/70 hover:text-primary transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  <span>hello@storyswap.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-white/70 hover:text-primary transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="h-5 w-5 mr-3" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-white/60 font-semibold">Follow us:</span>
                <motion.a 
                  href="#" 
                  className="text-white/80 hover:text-primary transition-all duration-300 hover:scale-110 inline-block"
                  whileHover={{ y: -3 }}
                >
                  Twitter
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-white/80 hover:text-primary transition-all duration-300 hover:scale-110 inline-block"
                  whileHover={{ y: -3 }}
                >
                  Instagram
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-white/80 hover:text-primary transition-all duration-300 hover:scale-110 inline-block"
                  whileHover={{ y: -3 }}
                >
                  Facebook
                </motion.a>
              </div>
            </motion.div>

            {/* Community Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold mb-6 text-xl text-white">Community</h4>
              <ul className="space-y-4 text-white/70">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Guidelines
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Safety
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Help Center
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Stories
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            {/* About Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold mb-6 text-xl text-white">About</h4>
              <ul className="space-y-4 text-white/70">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Our Mission
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Contact
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Privacy
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="hover:text-primary transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                    Terms
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-white/10 mt-16 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center text-white/60">
                <p className="flex items-center">
                  Made with 
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mx-2"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </motion.span>
                  by Story Swap Team
                </p>
              </div>
              <p className="text-white/60">&copy; 2025 Story Swap. Building community through shared stories.</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
