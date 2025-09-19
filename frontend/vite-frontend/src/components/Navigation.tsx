import { Button } from "@/components/ui/button";
import { MapPin, User, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { user, logout, showLogoutConfirmation, setShowLogoutConfirmation } = useAuth();

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // If user is logged in, prevent navigation to home page
    if (user) {
      e.preventDefault();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link 
            to={user ? "/explore" : "/"} 
            className="flex items-center space-x-3"
            onClick={handleLogoClick}
          >
            <MapPin className="h-9 w-9 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Story Swap
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md hover:bg-primary/10">
              Explore Stories
            </Link>
            <Link to="/map" className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md hover:bg-primary/10">
              Map View
            </Link>
            {user && (
              <>
                <Link to="/my-stories" className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md hover:bg-primary/10">
                  My Stories
                </Link>
                <Link to="/submit" className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md hover:bg-primary/10">
                  Add Story
                </Link>
              </>
            )}
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-md hover:bg-primary/10">
              Profile
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            <Button variant="ghost" size="sm" className="hidden md:flex px-4 py-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="px-3 py-2">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="px-4 py-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-4 py-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="btn-glow px-6 py-2">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;