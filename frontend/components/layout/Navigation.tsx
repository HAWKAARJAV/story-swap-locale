'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  MapPin, 
  Search, 
  Plus, 
  User, 
  Bell, 
  Menu, 
  X,
  Heart,
  Compass,
  Star,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    href: '/discover', 
    label: 'Discover', 
    icon: Compass,
    description: 'Explore stories from your city'
  },
  { 
    href: '/map', 
    label: 'Map', 
    icon: MapPin,
    description: 'Stories on the map'
  },
  { 
    href: '/create', 
    label: 'Create', 
    icon: Plus,
    description: 'Share your story'
  },
  { 
    href: '/favorites', 
    label: 'Favorites', 
    icon: Heart,
    description: 'Your saved stories'
  },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Main Navigation */}
      <motion.nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/70 backdrop-blur-xl border-b border-primary-200/10 shadow-sm" : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Story Swap
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group flex items-center space-x-2",
                      isActive 
                        ? "text-primary-400" 
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary-400/10 backdrop-blur-sm border border-primary-400/20 rounded-lg"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4" />
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.description}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <motion.button
                className="p-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/search')}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <motion.button
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      3
                    </span>
                  </motion.button>

                  {/* User Menu */}
                  <div className="relative group">
                    <motion.button
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-medium text-white">
                        {user?.displayName}
                      </span>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 glass backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-1">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed right-0 top-16 bottom-0 w-80 max-w-[90vw] glass backdrop-blur-xl border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6 space-y-6">
                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive 
                              ? "bg-primary-400/20 text-primary-400 border border-primary-400/30" 
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* User Section */}
                {isAuthenticated && user && (
                  <motion.div
                    className="border-t border-white/10 pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{user.displayName}</div>
                        <div className="text-sm text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}