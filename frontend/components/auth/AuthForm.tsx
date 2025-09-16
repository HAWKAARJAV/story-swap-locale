'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { AuthFormProps } from '@/types';
import Link from 'next/link';

// Validation schemas
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const registerSchema = yup.object({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  displayName: yup.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .required('Display name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  bio: yup.string().max(200, 'Bio must be less than 200 characters'),
});

const cities = [
  'Delhi', 'Mumbai', 'Chennai', 'Jaipur', 'Agra', 'Bangalore', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur'
];

const states = [
  'Delhi', 'Maharashtra', 'Tamil Nadu', 'Rajasthan', 'Uttar Pradesh', 
  'Karnataka', 'West Bengal', 'Telangana', 'Gujarat', 'Kerala', 'Punjab'
];

export default function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const schema = mode === 'login' ? loginSchema : registerSchema;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    watch 
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const formAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      variants={formAnimation}
    >
      {/* Header */}
      <motion.div className="text-center mb-8" variants={itemAnimation}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Join Story Swap'}
        </h1>
        <p className="text-gray-300">
          {mode === 'login' 
            ? 'Sign in to discover amazing local stories' 
            : 'Create your account to start sharing stories'
          }
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </motion.div>
      )}

      {/* Form */}
      <motion.form 
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        variants={itemAnimation}
      >
        {mode === 'register' && (
          <>
            {/* Username */}
            <Input
              label="Username"
              placeholder="your_username"
              icon={<User className="w-5 h-5" />}
              error={errors.username?.message}
              {...register('username')}
            />

            {/* Display Name */}
            <Input
              label="Display Name"
              placeholder="Your Full Name"
              icon={<User className="w-5 h-5" />}
              error={errors.displayName?.message}
              {...register('displayName')}
            />
          </>
        )}

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          showPasswordToggle
          error={errors.password?.message}
          {...register('password')}
        />

        {mode === 'register' && (
          <>
            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  City
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50"
                  {...register('city')}
                >
                  <option value="" className="text-gray-900">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city} className="text-gray-900">{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-sm text-red-400 mt-1">{errors.city.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  State
                </label>
                <select
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50"
                  {...register('state')}
                >
                  <option value="" className="text-gray-900">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state} className="text-gray-900">{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-sm text-red-400 mt-1">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Bio (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 placeholder:text-gray-500 resize-none"
                rows={3}
                placeholder="Tell us a bit about yourself..."
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-sm text-red-400 mt-1">{errors.bio.message}</p>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          isLoading={loading}
          disabled={!isValid}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </Button>
      </motion.form>

      {/* Footer */}
      <motion.div className="text-center mt-8" variants={itemAnimation}>
        <p className="text-gray-300">
          {mode === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "
          }
          <Link 
            href={mode === 'login' ? '/register' : '/login'}
            className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
        
        {mode === 'login' && (
          <Link 
            href="/forgot-password"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors block mt-2"
          >
            Forgot your password?
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}