import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedStories from "../components/FeaturedStories";
import { Star } from "lucide-react";

const Index = () => {
  return (
    <main className="pt-16">
      <HeroSection />
      <HowItWorks />
      <FeaturedStories />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/30 via-background to-accent/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-glow text-xs font-medium mb-6 backdrop-blur-sm">
                <span className="font-heading tracking-wider">JOIN OUR COMMUNITY</span>
              </div>
              
              <h2 className="font-heading text-4xl font-bold mb-6 leading-tight">
                Ready to Share 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent"> Your Story?</span>
              </h2>
              
              <p className="font-body text-lg text-foreground/80 mb-8 max-w-2xl leading-relaxed">
                Join thousands of storytellers who are building the world's most authentic travel and local discovery platform. Connect with travelers and locals around the globe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 font-semibold py-4 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Start Your Journey
                </button>
                <button className="border-2 border-primary/30 text-foreground hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Right Column - Featured Story Card */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              
              <div className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="absolute -top-4 -right-4">
                  <div className="bg-gradient-to-br from-accent to-primary p-2 rounded-full shadow-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-bold mb-4">Featured Story</h3>
                
                <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/5">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3">
                      <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center">
                        <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="User" className="w-8 h-8 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Aanya Sharma</div>
                      <div className="text-xs text-foreground/60">Local Expert • Delhi</div>
                    </div>
                  </div>
                  
                  <h4 className="font-heading text-lg font-medium mb-2">Hidden Gems of Old Delhi</h4>
                  <p className="text-sm text-foreground/70 mb-3">
                    "Beyond the tourist spots, Old Delhi has secret corners where time stands still. Let me show you where locals gather..."
                  </p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>4.9 (127 ratings)</span>
                    </div>
                    <span className="text-primary-glow">Read More →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground/95 to-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary-glow opacity-70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">Story Swap</h3>
              </div>
              
              <p className="text-background/80 mb-6 font-body">
                Connecting the world through authentic local stories and shared experiences. 
                Discover hidden gems and create meaningful connections wherever you go.
              </p>
              
              <div className="flex space-x-5">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-bold mb-5 text-white">Community</h4>
              <ul className="space-y-3 font-body">
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Guidelines</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Safety</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Help Center</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Events</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-bold mb-5 text-white">About</h4>
              <ul className="space-y-3 font-body">
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Our Mission</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Contact</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Privacy</a></li>
                <li><a href="#" className="text-background/70 hover:text-primary-glow transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60 font-body">
            <p>&copy; 2024 Story Swap. Building community through shared stories.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
