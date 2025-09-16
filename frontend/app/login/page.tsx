'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import DynamicBackground, { useUserLocation } from '@/components/ui/DynamicBackground';
import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const { login, isLoading } = useAuthStore();
  const { city } = useUserLocation();
  const router = useRouter();

  const handleLogin = async (data: any) => {
    try {
      setError('');
      await login(data.email, data.password);
      router.push('/discover');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <DynamicBackground city={city} variant="auth">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* City Selector */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-300 text-sm mb-2">Signing in from</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass backdrop-blur-xl border border-white/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium capitalize">{city}</span>
            </div>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <AuthForm
                mode="login"
                onSubmit={handleLogin}
                loading={isLoading}
                error={error}
              />
            </div>
          </motion.div>

          {/* Demo Users */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="mt-8 glass backdrop-blur-xl border border-white/10 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-gray-300 text-sm mb-3 text-center">Demo Users</p>
              <div className="space-y-2">
                <button
                  onClick={() => handleLogin({ email: 'demo@storyswap.com', password: 'demo123' })}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  📚 demo@storyswap.com (Regular User)
                </button>
                <button
                  onClick={() => handleLogin({ email: 'admin@storyswap.com', password: 'admin123' })}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  👑 admin@storyswap.com (Admin)
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DynamicBackground>
  );
}