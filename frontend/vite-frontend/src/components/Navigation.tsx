import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  User,
  LogOut,
  Search,
  Globe,
  BookOpen,
  PenTool,
  Heart,
  Menu,
  ChevronDown,
  Bell,
  Settings,
  Zap,
  Plus,
  Sparkles,
  Bot,
  Share2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowLogoutConfirmation } = useAuth();
  const isSignedIn = !!user;

  // State management
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const notificationCount = 3; // Mock notification count

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  return (
    <>
      <style>{`
        .dynamic-island-complete {
          position: relative;
          margin: 16px auto;
          max-width: 95vw;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 8px 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
        }

        .dynamic-island-complete.collapsed {
          border-radius: 32px;
          padding: 6px 12px;
          transform: scale(0.95);
        }

        .dynamic-island-complete.expanded {
          border-radius: 20px;
          padding: 12px 24px;
          transform: scale(1.02);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .nav-island-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .nav-island-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-island-item.special-glow {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .nav-island-item.special-glow:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        .island-button {
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .island-button.primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .island-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .island-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .island-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .quick-actions-island {
          position: fixed;
          top: 80px;
          right: 20px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 40;
        }

        .quick-actions-island.hidden {
          opacity: 0;
          transform: translateY(-10px) scale(0.9);
          pointer-events: none;
        }

        .quick-actions-island.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .quick-actions-menu {
          display: flex;
          gap: 8px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .quick-actions-menu.collapsed {
          width: 0;
          opacity: 0;
        }

        .quick-actions-menu.expanded {
          width: auto;
          opacity: 1;
        }

        .quick-action-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .quick-action-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .expansion-indicator {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .expansion-indicator.expanded {
          width: 40px;
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-[9000]">
        {/* Dynamic Island Container */}
        <div 
          className={`dynamic-island-complete transition-all duration-500 ease-in-out ${
            isExpanded ? 'expanded' : 'collapsed'
          }`}
          style={{ overflow: 'visible' }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            setIsExpanded(false);
            setHoveredItem(null);
          }}
        >
          {/* Core Island Content */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group flex-shrink-0"
            >
              <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <MapPin className="h-5 w-5 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300 hidden sm:block">
                Story Swap
              </span>
            </Link>

            {/* Navigation Items */}
            <div className={`flex items-center space-x-1 transition-all duration-500 ${
              isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              
              {/* Core Navigation */}
              <div className="flex items-center space-x-1">
                <Link 
                  to="/explore" 
                  className="nav-island-item"
                  onMouseEnter={() => setHoveredItem('explore')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden lg:block">Explore</span>
                </Link>

                {isSignedIn && (
                  <>
                    <Link 
                      to="/submit" 
                      className="nav-island-item"
                      onMouseEnter={() => setHoveredItem('add')}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <PenTool className="h-4 w-4" />
                      <span className="hidden lg:block">Add</span>
                    </Link>
                    
                    <Link 
                      to="/my-stories" 
                      className="nav-island-item"
                      onMouseEnter={() => setHoveredItem('stories')}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden lg:block">Stories</span>
                    </Link>
                    
                    <Link 
                      to="/plan" 
                      className="nav-island-item special-glow"
                      onMouseEnter={() => setHoveredItem('plan')}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden lg:block">Plan Trip</span>
                    </Link>
                  </>
                )}

                {/* Quick Actions Trigger */}
                {isSignedIn && (
                  <button 
                    className="nav-island-item"
                    onMouseEnter={() => {
                      setHoveredItem('quick');
                      setShowQuickActions(true);
                    }}
                    onClick={() => setShowQuickActions(!showQuickActions)}
                  >
                    <Zap className="h-4 w-4" />
                    <span className="hidden lg:block">Quick</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isSignedIn ? (
                <div className="relative flex items-center space-x-3">
                  {/* Notifications */}
                  <button
                    className="relative p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/20"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-5 w-5 text-white" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu Button - Always Visible */}
                  <button
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 transition-all duration-300 border border-white/30 hover:border-white/50 shadow-lg"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onMouseEnter={() => setShowUserMenu(true)}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {user?.displayName || user?.username || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div 
                      className="absolute top-full right-20 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[9999]"
                      onMouseLeave={() => setShowNotifications(false)}
                    >
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-3">Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-white/90 text-sm">New story from Tokyo adventure</p>
                              <p className="text-white/60 text-xs">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-white/90 text-sm">Your story got 5 new likes</p>
                              <p className="text-white/60 text-xs">1 day ago</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-white/90 text-sm">AI suggested a new trip plan</p>
                              <p className="text-white/60 text-xs">2 days ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[9999]"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-white font-semibold">
                            {user?.displayName || user?.username || 'User'}
                          </h3>
                          <p className="text-white/70 text-sm">Thank you for joining!</p>
                          <p className="text-white/60 text-xs mt-1">Here you go, start exploring...</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Link 
                            to="/my-stories" 
                            className="flex items-center space-x-2 w-full px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>My Stories</span>
                          </Link>
                          
                          <Link 
                            to="/submit" 
                            className="flex items-center space-x-2 w-full px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <PenTool className="h-4 w-4" />
                            <span>Add Story</span>
                          </Link>
                          
                          <Link 
                            to="/profile" 
                            className="flex items-center space-x-2 w-full px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          
                          <hr className="border-white/20 my-2" />
                          
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              handleLogoutClick();
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <button className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-lg">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/50">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Expansion Indicator */}
          <div className={`expansion-indicator ${isExpanded ? 'expanded' : ''}`}></div>
        </div>

        {/* Quick Actions Island */}
        {isSignedIn && (
          <div 
            className={`quick-actions-island ${showQuickActions ? 'visible' : 'hidden'}`}
            onMouseEnter={() => setShowQuickActions(true)}
            onMouseLeave={() => setShowQuickActions(false)}
          >
            <div className="flex items-center space-x-2">
              <button 
                className="quick-action-btn p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                onClick={() => setShowQuickActions(!showQuickActions)}
              >
                <Zap className="h-4 w-4 text-white" />
              </button>
              
              <div className={`quick-actions-menu ${showQuickActions ? 'expanded' : 'collapsed'}`}>
                <Link to="/submit" className="quick-action-item">
                  <Plus className="h-4 w-4" />
                  <span>New Story</span>
                </Link>
                
                <Link to="/plan" className="quick-action-item">
                  <Bot className="h-4 w-4" />
                  <span>AI Planner</span>
                </Link>
                
                <Link to="/favorites" className="quick-action-item">
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Link>
                
                <button className="quick-action-item">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;