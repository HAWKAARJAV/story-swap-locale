import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedStories from "../components/FeaturedStories";
import { Star, ArrowRight } from "lucide-react";

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

      {/* Footer */}
      <footer className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Story Swap</h3>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">
                Connecting the world through authentic local stories and shared experiences. 
                Discover hidden gems and create meaningful connections through storytelling.
              </p>
              <div className="flex space-x-6">
                <span className="text-white/60">Follow us:</span>
                <a href="#" className="text-white/80 hover:text-primary transition-colors duration-300">Twitter</a>
                <a href="#" className="text-white/80 hover:text-primary transition-colors duration-300">Instagram</a>
                <a href="#" className="text-white/80 hover:text-primary transition-colors duration-300">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Community</h4>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Safety</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">About</h4>
              <ul className="space-y-3 text-white/80">
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Our Mission</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-300">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2025 Story Swap. Building community through shared stories.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
