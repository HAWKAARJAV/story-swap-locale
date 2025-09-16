'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Loader,
  Github,
  Chrome
} from 'lucide-react';
import { Button } from './Button';

interface AuthFormProps {
  mode?: 'login' | 'register';
  onSubmit: (data: AuthFormData, mode: 'login' | 'register') => Promise<void>;
  onModeChange?: (mode: 'login' | 'register') => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
  confirmPassword?: string;
}

export default function AuthForm({
  mode = 'login',
  onSubmit,
  onModeChange,
  loading = false,
  error = '',
  className = ''
}: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(mode);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }
    return undefined;
  };

  const validateUsername = (username: string): string | undefined => {
    if (currentMode === 'register') {
      if (!username) return 'Username is required';
      if (username.length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (currentMode === 'register') {
      if (!confirmPassword) return 'Please confirm your password';
      if (confirmPassword !== password) return 'Passwords do not match';
    }
    return undefined;
  };

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    
    if (currentMode === 'register') {
      errors.username = validateUsername(formData.username || '');
      errors.confirmPassword = validateConfirmPassword(formData.confirmPassword || '', formData.password);
    }

    return Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value !== undefined)
    );
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof AuthFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error: string | undefined;
    switch (field) {
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'username':
        error = validateUsername(formData.username || '');
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword || '', formData.password);
        break;
    }
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setCurrentMode(newMode);
    setValidationErrors({});
    setTouched({});
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      await onSubmit(formData, currentMode);
    }
  };

  const InputField = ({ 
    type, 
    field, 
    placeholder, 
    icon: Icon, 
    showToggle = false 
  }: {
    type: string;
    field: keyof AuthFormData;
    placeholder: string;
    icon: React.ElementType;
    showToggle?: boolean;
  }) => {
    const hasError = validationErrors[field] && touched[field];
    const isValid = touched[field] && !validationErrors[field] && formData[field];

    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type={showToggle ? (
              field === 'password' ? (showPassword ? 'text' : 'password') :
              field === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') : type
            ) : type}
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleInputBlur(field)}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${hasError 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-500' 
                : isValid 
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-500'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            `}
            disabled={loading}
          />

          {showToggle && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                if (field === 'password') setShowPassword(!showPassword);
                if (field === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
              }}
              disabled={loading}
            >
              {(field === 'password' ? showPassword : showConfirmPassword) ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}

          {hasError && (
            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}

          {isValid && (
            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {validationErrors[field]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <motion.div
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-8 border border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            key={currentMode}
            initial={{ opacity: 0, x: currentMode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentMode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join our community and start sharing stories'
            }
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, x: currentMode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentMode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentMode === 'register' && (
                <InputField
                  type="text"
                  field="username"
                  placeholder="Username"
                  icon={User}
                />
              )}

              <InputField
                type="email"
                field="email"
                placeholder="Email address"
                icon={Mail}
              />

              <InputField
                type="password"
                field="password"
                placeholder="Password"
                icon={Lock}
                showToggle={true}
              />

              {currentMode === 'register' && (
                <InputField
                  type="password"
                  field="confirmPassword"
                  placeholder="Confirm password"
                  icon={Lock}
                  showToggle={true}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader className="h-5 w-5 animate-spin mr-2" />
                {currentMode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              currentMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </Button>
            </div>
          </div>
        </form>

        {/* Mode Switch */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {currentMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => handleModeSwitch(currentMode === 'login' ? 'register' : 'login')}
              className="ml-2 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              disabled={loading}
            >
              {currentMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}