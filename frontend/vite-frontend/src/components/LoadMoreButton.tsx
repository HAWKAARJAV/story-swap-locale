import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  text?: string;
  disabled?: boolean;
  className?: string;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  loading = false,
  text = "Load More",
  disabled = false,
  className = ""
}) => {
  const rippleVariants = {
    initial: { scale: 0, opacity: 0.8 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    loading: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  const gradientVariants = {
    idle: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    hover: {
      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    idle: { rotate: 0 },
    hover: { rotate: 180, transition: { duration: 0.3 } },
    loading: { 
      rotate: 360,
      transition: { duration: 1, repeat: Infinity }
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      variants={buttonVariants}
      initial="idle"
      animate={loading ? "loading" : "idle"}
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
    >
      {/* Gradient Background Animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        variants={gradientVariants}
        initial="idle"
        animate={loading ? "idle" : "idle"}
      />

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white"
        variants={rippleVariants}
        initial="initial"
        animate="initial"
        whileTap="animate"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-3">
        <motion.div
          variants={iconVariants}
          initial="idle"
          animate={loading ? "loading" : "idle"}
          whileHover={!disabled && !loading ? "hover" : "idle"}
        >
          {loading ? (
            <Loader2 className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </motion.div>
        
        <motion.span
          className="text-lg"
          animate={loading ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
          transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {loading ? "Loading..." : text}
        </motion.span>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Loading Particles */}
      {loading && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: "50%"
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        animate={loading ? {
          borderColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.2)"]
        } : {}}
        transition={loading ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
    </motion.button>
  );
};

export default LoadMoreButton;