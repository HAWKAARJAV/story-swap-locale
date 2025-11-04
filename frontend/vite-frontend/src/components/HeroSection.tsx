import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, ArrowRight, Globe, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
  
  // Counting animation states
  const [storiesCount, setStoriesCount] = useState(0);
  const [citiesCount, setCitiesCount] = useState(0);
  const [swappersCount, setSwappersCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Target values for counting
  const targetStories = 2847;
  const targetCities = 156;
  const targetSwappers = 1234;

  // Auto-rotate background images - Optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000); // Change every 8 seconds to reduce transitions
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Counting animation effect - Start immediately on mount
  useEffect(() => {
    // Delay start slightly to make animation more visible
    const startDelay = setTimeout(() => {
      if (!hasAnimated) {
        setHasAnimated(true);
        
        // Animate Stories Count
        const storiesDuration = 2500;
        const storiesSteps = 60;
        const storiesIncrement = targetStories / storiesSteps;
        let storiesStep = 0;
        const storiesInterval = setInterval(() => {
          storiesStep++;
          if (storiesStep >= storiesSteps) {
            setStoriesCount(targetStories);
            clearInterval(storiesInterval);
          } else {
            setStoriesCount(Math.floor(storiesStep * storiesIncrement));
          }
        }, storiesDuration / storiesSteps);

        // Animate Cities Count
        const citiesDuration = 2500;
        const citiesSteps = 60;
        const citiesIncrement = targetCities / citiesSteps;
        let citiesStep = 0;
        const citiesInterval = setInterval(() => {
          citiesStep++;
          if (citiesStep >= citiesSteps) {
            setCitiesCount(targetCities);
            clearInterval(citiesInterval);
          } else {
            setCitiesCount(Math.floor(citiesStep * citiesIncrement));
          }
        }, citiesDuration / citiesSteps);

        // Animate Swappers Count
        const swappersDuration = 2500;
        const swappersSteps = 60;
        const swappersIncrement = targetSwappers / swappersSteps;
        let swappersStep = 0;
        const swappersInterval = setInterval(() => {
          swappersStep++;
          if (swappersStep >= swappersSteps) {
            setSwappersCount(targetSwappers);
            clearInterval(swappersInterval);
          } else {
            setSwappersCount(Math.floor(swappersStep * swappersIncrement));
          }
        }, swappersDuration / swappersSteps);
      }
    }, 1000); // Start after 1 second

    return () => clearTimeout(startDelay);
  }, [hasAnimated]);
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
          
          {/* Animated Gradient Heading with Text Reveal */}
          <motion.h1 
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight gradient-animated-text overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="inline-block"
            >
              Share Stories,
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="inline-block"
            >
              Discover Cities
            </motion.span>
          </motion.h1>
          
          {/* Subtitle with Reveal Animation */}
          <motion.p 
            className="font-body text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            Connect with travelers and locals worldwide through authentic stories. 
            <br className="hidden sm:block" />
            Unlock hidden gems and share your adventures.
          </motion.p>

          {/* Enhanced Call-to-Action Buttons with Reveal Animation */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
          >
            <Button 
              size="lg" 
              className="btn-magnetic bg-gradient-to-r from-primary to-primary-glow text-white text-lg px-12 py-5 h-auto rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all duration-500 group"
              onClick={() => navigate('/explore')}
            >
              <MapPin className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Exploring
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            {user ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-magnetic glass-enhanced border-2 border-white/40 text-white hover:bg-white hover:text-secondary text-lg px-12 py-5 h-auto rounded-2xl transition-all duration-500 group"
                onClick={() => navigate('/submit')}
              >
                <BookOpen className="mr-3 h-5 w-5 group-hover:rotate-6 transition-transform duration-300" />
                Share Your Story
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-magnetic glass-enhanced border-2 border-white/40 text-white hover:bg-white hover:text-secondary text-lg px-12 py-5 h-auto rounded-2xl transition-all duration-500 group"
                onClick={() => navigate('/register')}
              >
                <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Join Community
              </Button>
            )}
          </motion.div>

          {/* Enhanced Stats Cards with Tilt Effects and Counting Animation */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6s' }}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-all duration-300" style={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                  transform: storiesCount > 0 ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.3s ease'
                }}>
                  {storiesCount.toLocaleString()}
                </div>
                <div className="text-white font-semibold text-lg mb-1">Stories Shared</div>
                <div className="text-white/70 text-sm">From travelers worldwide</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6.2s' }}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-all duration-300" style={{
                  textShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                  transform: citiesCount > 0 ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.3s ease'
                }}>
                  {citiesCount.toLocaleString()}
                </div>
                <div className="text-white font-semibold text-lg mb-1">Cities Covered</div>
                <div className="text-white/70 text-sm">Across 6 continents</div>
                <div className="mt-3 w-12 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="card-tilt glass-enhanced p-8 rounded-3xl shadow-2xl border border-white/30 group animate-slide-up" style={{ animationDelay: '6.4s' }}>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-all duration-300" style={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                  transform: swappersCount > 0 ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.3s ease'
                }}>
                  {swappersCount.toLocaleString()}
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