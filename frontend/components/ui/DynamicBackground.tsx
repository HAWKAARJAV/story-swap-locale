'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCityTheme } from '@/lib/utils';

interface DynamicBackgroundProps {
  city?: string;
  variant?: 'default' | 'auth' | 'story' | 'map';
  children?: React.ReactNode;
  className?: string;
}

const cityBackgrounds = {
  delhi: {
    primary: 'from-purple-900 via-blue-900 to-indigo-800',
    secondary: 'from-indigo-400/20 to-purple-600/20',
    accent: '#667eea',
    pattern: '/patterns/delhi-pattern.svg',
    landmarks: ['Red Fort', 'India Gate', 'Lotus Temple']
  },
  mumbai: {
    primary: 'from-pink-900 via-rose-800 to-red-800', 
    secondary: 'from-pink-400/20 to-red-500/20',
    accent: '#f093fb',
    pattern: '/patterns/mumbai-pattern.svg',
    landmarks: ['Gateway of India', 'Marine Drive', 'Taj Hotel']
  },
  chennai: {
    primary: 'from-cyan-900 via-blue-800 to-teal-800',
    secondary: 'from-cyan-400/20 to-blue-500/20', 
    accent: '#4facfe',
    pattern: '/patterns/chennai-pattern.svg',
    landmarks: ['Marina Beach', 'Kapaleeshwarar Temple', 'Government Museum']
  },
  jaipur: {
    primary: 'from-orange-900 via-pink-800 to-yellow-800',
    secondary: 'from-orange-400/20 to-yellow-500/20',
    accent: '#fa709a',
    pattern: '/patterns/jaipur-pattern.svg', 
    landmarks: ['Hawa Mahal', 'City Palace', 'Amber Fort']
  },
  agra: {
    primary: 'from-emerald-900 via-teal-800 to-cyan-800',
    secondary: 'from-emerald-400/20 to-cyan-500/20',
    accent: '#a8edea',
    pattern: '/patterns/agra-pattern.svg',
    landmarks: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh']
  }
};

const variantStyles = {
  default: 'min-h-screen',
  auth: 'min-h-screen',
  story: 'min-h-[60vh]',
  map: 'h-full'
};

export default function DynamicBackground({ 
  city = 'delhi', 
  variant = 'default', 
  children,
  className = '' 
}: DynamicBackgroundProps) {
  const [currentCity, setCurrentCity] = useState(city.toLowerCase());
  const [isLoading, setIsLoading] = useState(false);
  
  const background = cityBackgrounds[currentCity as keyof typeof cityBackgrounds] || cityBackgrounds.delhi;

  useEffect(() => {
    if (city.toLowerCase() !== currentCity) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setCurrentCity(city.toLowerCase());
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [city, currentCity]);

  return (
    <div className={`relative overflow-hidden ${variantStyles[variant]} ${className}`}>
      {/* Base Gradient Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCity}
          className={`absolute inset-0 bg-gradient-to-br ${background.primary}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70`}
          style={{ background: `linear-gradient(45deg, ${background.accent}40, ${background.accent}20)` }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70`}
          style={{ background: `linear-gradient(135deg, ${background.accent}30, ${background.accent}10)` }}
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -90, 0],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-50`}
          style={{ background: `radial-gradient(circle, ${background.accent}20, transparent 70%)` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      {/* Secondary Overlay */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-t ${background.secondary}`}
        animate={{ 
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 0.3, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Parallax Layers */}
      {variant !== 'auth' && (
        <div className="absolute inset-0">
          {/* Far Layer */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'] 
            }}
            transition={{ 
              duration: 60, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='17' cy='27' r='1'/%3E%3Ccircle cx='37' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Mid Layer */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ 
              backgroundPosition: ['0% 0%', '-100% -100%'] 
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      )}

      {/* Loading Transition */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* City Name Indicator (for debugging/demo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            {currentCity.charAt(0).toUpperCase() + currentCity.slice(1)}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook to detect user's city from various sources
export function useUserLocation() {
  const [city, setCity] = useState<string>('delhi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get from localStorage first
        const savedCity = localStorage.getItem('user-city');
        if (savedCity) {
          setCity(savedCity);
          setLoading(false);
          return;
        }

        // Try geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // In a real app, you'd use a geocoding service here
                // For demo, we'll just set to Delhi
                const detectedCity = 'delhi';
                setCity(detectedCity);
                localStorage.setItem('user-city', detectedCity);
              } catch (error) {
                console.warn('Geocoding failed:', error);
                setCity('delhi');
              } finally {
                setLoading(false);
              }
            },
            () => {
              // Geolocation failed, fallback to Delhi
              setCity('delhi');
              setLoading(false);
            },
            { timeout: 5000, enableHighAccuracy: false }
          );
        } else {
          setCity('delhi');
          setLoading(false);
        }
      } catch (error) {
        console.warn('Location detection failed:', error);
        setCity('delhi');
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const updateCity = (newCity: string) => {
    setCity(newCity.toLowerCase());
    localStorage.setItem('user-city', newCity.toLowerCase());
  };

  return { city, loading, updateCity };
}