'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import DynamicBackground, { useUserLocation } from '@/components/ui/DynamicBackground';
import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';
import { RegisterData } from '@/types';

export default function RegisterPage() {
  const [error, setError] = useState<string>('');
  const { register: registerUser, isLoading } = useAuthStore();
  const { city } = useUserLocation();
  const router = useRouter();

  const handleRegister = async (data: any) => {
    try {
      setError('');
      
      const userData: RegisterData = {
        username: data.username,
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        city: data.city,
        state: data.state,
        bio: data.bio,
        preferences: {
          language: 'en',
          notifications: true,
        },
      };

      await registerUser(userData);
      router.push('/discover');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <DynamicBackground city={city} variant="auth">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              Start Your Story Journey
            </h2>
            <p className="text-gray-300 text-sm">
              Join thousands of storytellers from {' '}
              <span className="capitalize font-medium text-primary-400">{city}</span>
              {' '} and beyond
            </p>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <AuthForm
                mode="register"
                onSubmit={handleRegister}
                loading={isLoading}
                error={error}
              />
            </div>
          </motion.div>

          {/* Terms and Privacy */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-xs text-gray-400">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
                Privacy Policy
              </a>
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            className="mt-8 glass backdrop-blur-xl border border-white/10 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h3 className="text-white font-semibold mb-4 text-center">What you'll get:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-sm">📖</span>
                </div>
                <span className="text-gray-300 text-sm">Access to exclusive local stories</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-secondary-400 text-sm">🔄</span>
                </div>
                <span className="text-gray-300 text-sm">Story swap system to unlock content</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-500/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-400 text-sm">🏆</span>
                </div>
                <span className="text-gray-300 text-sm">Earn badges and build your reputation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-500/20 rounded-full flex items-center justify-center">
                  <span className="text-success-400 text-sm">🌍</span>
                </div>
                <span className="text-gray-300 text-sm">Connect with your local community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DynamicBackground>
  );
}