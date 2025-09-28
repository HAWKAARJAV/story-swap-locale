import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, ArrowRight, Globe, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Dynamic background images carousel
  const backgroundImages = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Mountain Adventures"
    },
    {
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "City Explorations"
    },
    {
      url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Coastal Journeys"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Forest Escapes"
    },
    {
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Desert Wonders"
    }
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // Auto-rotate background images - Optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000); // Change every 8 seconds to reduce transitions
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background Carousel */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-800 ease-in-out ${
            index === currentBgIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('${image.url}')`,
            willChange: 'opacity'
          }}
        />
      ))}
      
      {/* Reduced Floating Particles */}
      <div className="absolute inset-0">
        <div className="floating absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="floating absolute bottom-32 left-20 w-3 h-3 bg-accent/20 rounded-full"></div>
        <div className="floating absolute bottom-40 right-1/3 w-2 h-2 bg-primary/20 rounded-full"></div>
      </div>
      
      {/* Simple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-30" />

      {/* Content - Centered Layout like travel sites */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="text-center">
          {/* Enhanced Badge with Glassmorphism */}
          <div className="inline-block px-8 py-3 rounded-full glass-enhanced text-white text-sm font-semibold mb-8 shadow-2xl animate-fade-in">
            <span className="font-heading tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              DISCOVER • SHARE • CONNECT
              <Globe className="w-4 h-4 ml-2 animate-spin" style={{ animationDuration: '8s' }} />
            </span>
          </div>
          
          {/* Simplified Main Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight text-white animate-fade-in">
            Share Stories,
            <br />
            <span className="text-primary">
              Discover Cities
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="font-body text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with travelers and locals worldwide through authentic stories. 
            <br className="hidden sm:block" />
            Unlock hidden gems and share your adventures.
          </p>

          {/* Enhanced Call-to-Action Buttons with Magnetic Effects */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="btn-magnetic bg-gradient-to-r from-primary to-primary-glow text-white text-lg px-12 py-5 h-auto rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all duration-500 group animate-fade-in"
              onClick={() => navigate('/explore')}
              style={{ animationDelay: '5s' }}
            >
              <MapPin className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Exploring
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            {user ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-magnetic glass-enhanced border-2 border-white/40 text-white hover:bg-white hover:text-secondary text-lg px-12 py-5 h-auto rounded-2xl transition-all duration-500 group animate-fade-in"
                onClick={() => navigate('/submit')}
                style={{ animationDelay: '5.5s' }}
              >
                <BookOpen className="mr-3 h-5 w-5 group-hover:rotate-6 transition-transform duration-300" />
                Share Your Story
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-magnetic glass-enhanced border-2 border-white/40 text-white hover:bg-white hover:text-secondary text-lg px-12 py-5 h-auto rounded-2xl transition-all duration-500 group animate-fade-in"
                onClick={() => navigate('/register')}
                style={{ animationDelay: '5.5s' }}
              >
                <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Join Community
              </Button>
            )}
          </div>

          {/* Enhanced Stats Cards with Tilt Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  2,847
                </div>
                <div className="text-white font-semibold text-lg mb-1">Stories Shared</div>
                <div className="text-white/70 text-sm">From travelers worldwide</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6.2s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  156
                </div>
                <div className="text-white font-semibold text-lg mb-1">Cities Covered</div>
                <div className="text-white/70 text-sm">Across 6 continents</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6.4s' }}>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  1,234
                </div>
                <div className="text-white font-semibold text-lg mb-1">Story Swappers</div>
                <div className="text-white/70 text-sm">Active community members</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentBgIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentBgIndex(index)}
          />
        ))}
      </div>

      {/* Fixed Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="glass-enhanced w-8 h-14 border-2 border-white/60 rounded-full flex justify-center items-start pt-3">
          <div className="w-1 h-4 bg-gradient-to-b from-white to-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;