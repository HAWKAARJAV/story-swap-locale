import { Button } from "@/components/ui/button";
import { MapPin, Plus, Search, BookOpen, PenTool, User, Menu, X, Zap, Heart, Share2, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navigation = () => {
  const { user, logout, showLogoutConfirmation, setShowLogoutConfirmation } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isSignedIn = !!user;

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // Logo always navigates to explore page for logged in users, landing page for others
    // No need to prevent default behavior
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Dynamic Island Container - Complete Full Width */}
      <div 
        className={`dynamic-island-complete transition-all duration-500 ease-in-out ${
          isExpanded ? 'expanded' : 'collapsed'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setHoveredItem(null);
        }}
      >
        {/* Core Island Content */}
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          
          {/* Logo Section - Always Visible */}
          <Link 
            to={isSignedIn ? "/explore" : "/"} 
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

          {/* Navigation Items - Appear on Expansion */}
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
                </>
              )}



              {/* Quick Actions Trigger */}
              {isSignedIn && (
                <button 
                  className="nav-island-item quick-trigger"
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
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isSignedIn ? (
              <div className="relative flex items-center space-x-2">
                {/* User Menu Button */}
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={() => setShowUserMenu(true)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Menu className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium text-sm hidden sm:block">
                    {user?.displayName || user?.username || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50"
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
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <button className="island-button secondary">
                    <span>Start Exploring</span>
                  </button>
                </Link>
                <Link to="/register">
                  <button className="island-button primary">
                    <span>Join Community</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Expansion Indicator */}
        <div className={`expansion-indicator ${isExpanded ? 'expanded' : ''}`}></div>
      </div>

      {/* Quick Actions Island - Appears on Special Hover */}
      {isSignedIn && (
        <div 
          className={`quick-actions-island ${showQuickActions ? 'visible' : 'hidden'}`}
          onMouseEnter={() => setShowQuickActions(true)}
          onMouseLeave={() => setShowQuickActions(false)}
        >
          <div className="flex items-center space-x-2">
            <button 
              className="quick-action-btn"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              <Zap className="h-4 w-4" />
            </button>
            
            <div className={`quick-actions-menu ${showQuickActions ? 'expanded' : 'collapsed'}`}>
              <Link to="/submit" className="quick-action-item">
                <Plus className="h-4 w-4" />
                <span>New Story</span>
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
  );
};

export default Navigation;