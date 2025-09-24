'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    isLoading = false,
    icon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]"
    );

    const variants = {
      default: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transition-all",
      outline: "border border-primary-300/20 bg-transparent text-primary-500 hover:bg-primary-50/10 focus:ring-primary-500 transition-all",
      secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-md hover:shadow-lg transition-all",
      ghost: "hover:bg-primary-50/10 text-primary-500 focus:ring-primary-500 transition-all",
      link: "text-primary-500 underline-offset-4 hover:underline focus:ring-primary-500 transition-all",
      gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all"
    };

    const sizes = {
      default: "h-11 px-6 py-2 text-sm",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-11 w-11"
    };

    return (
      <motion.button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Icon */}
        {!isLoading && icon && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        
        {/* Children */}
        {!isLoading && children && (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
        )}
        
        {/* Loading Text */}
        {isLoading && children && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            Loading...
          </motion.span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };