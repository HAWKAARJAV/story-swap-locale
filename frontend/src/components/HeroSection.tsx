import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, ArrowRight, Globe, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Simplified background rotation
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const backgroundImages = [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale }}
    >
      {/* Clean Background with Smooth Transition */}
      {backgroundImages.map((url, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentBgIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%), url('${url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}

      {/* Modern Clean Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center">
          {/* Sleek Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm tracking-wide">AI-Powered Travel Stories</span>
          </motion.div>

          {/* Powerful Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
            style={{
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            Discover Stories,
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Plan Adventures
            </span>
          </motion.h1>

          {/* Clear Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl md:text-2xl text-white/95 max-w-3xl mx-auto"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            Share authentic travel experiences and get AI-powered trip recommendations
            tailored to your journey.
          </motion.p>

          {/* Clear CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/explore')}
              className="group bg-white text-gray-900 hover:bg-white/95 px-8 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
            >
              <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Explore Stories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {user ? (
              <Button
                size="lg"
                onClick={() => navigate('/submit')}
                className="group border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-2xl backdrop-blur-md transition-all duration-300"
                style={{ backdropFilter: 'blur(20px)' }}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Share Your Story
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate('/plan')}
                className="group border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-2xl backdrop-blur-md transition-all duration-300"
                style={{ backdropFilter: 'blur(20px)' }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Plan with AI
              </Button>
            )}
          </motion.div>

          {/* Modern Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: BookOpen, value: "2,847+", label: "Stories Shared" },
              { icon: Globe, value: "156", label: "Cities Covered" },
              { icon: TrendingUp, value: "1,234+", label: "Active Travelers" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Minimalist Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center items-start pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-white/70 rounded-full"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
