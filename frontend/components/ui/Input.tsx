'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'ghost';
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    icon, 
    variant = 'default',
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    const baseStyles = cn(
      "w-full px-4 py-3 rounded-lg border transition-all duration-200 placeholder:text-gray-500",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      // Default variant
      variant === 'default' && [
        "bg-white/5 backdrop-blur-sm border-primary-300/20 text-foreground",
        "focus:ring-primary-400/40 focus:border-primary-400/40",
        "hover:border-primary-300/30",
        error && "border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50"
      ],
      // Ghost variant
      variant === 'ghost' && [
        "bg-transparent border-gray-200 text-gray-900 dark:text-gray-100 dark:border-gray-700",
        "focus:ring-primary-500 focus:border-primary-500",
        "hover:border-primary-300",
        error && "border-red-500 focus:ring-red-500 focus:border-red-500"
      ],
      icon && "pl-11",
      (showPasswordToggle && type === 'password') && "pr-11",
      className
    );

    return (
      <div className="space-y-1">
        {/* Label */}
        {label && (
          <motion.label 
            className={cn(
              "block text-sm font-medium",
              variant === 'default' ? "text-gray-200" : "text-gray-700",
              error && "text-red-400"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input */}
          <motion.input
            type={inputType}
            className={baseStyles}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            {...props}
          />

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Focus Ring Animation */}
          {isFocused && (
            <motion.div
              className={cn(
                "absolute inset-0 rounded-lg pointer-events-none",
                variant === 'default' && "ring-2 ring-primary-400/50",
                variant === 'ghost' && "ring-2 ring-primary-500"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p 
            className="text-sm text-red-400 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className={cn(
            "text-sm",
            variant === 'default' ? "text-gray-400" : "text-gray-600"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };