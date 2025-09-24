import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, ArrowRight, Globe, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-accent/20 opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 animate-pulse opacity-40">
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary-glow to-accent blur-xl"></div>
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse opacity-30" style={{ animationDelay: '1s' }}>
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-accent to-secondary blur-xl"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-pulse opacity-20" style={{ animationDelay: '2s' }}>
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-secondary to-primary-glow blur-lg"></div>
      </div>

      {/* Content - Two Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="animate-fade-in text-left">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-glow text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="font-heading tracking-wider">NATIONAL STARTUP HACKATHON 2024</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Swap Stories,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent">Discover Cities</span>
            </h1>
            
            <p className="font-body text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl leading-relaxed">
              Share your local adventures and unlock authentic stories from travelers and locals around the world. Join our community of passionate storytellers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 text-lg px-8 py-6 h-auto rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={() => navigate('/explore')}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              {user ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-foreground hover:bg-white/5 text-lg px-8 py-6 h-auto rounded-lg backdrop-blur-sm"
                  onClick={() => navigate('/submit')}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Share Your Story
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-foreground hover:bg-white/5 text-lg px-8 py-6 h-auto rounded-lg backdrop-blur-sm"
                  onClick={() => navigate('/register')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              )}
            </div>

            {/* Stats - Enhanced */}
            <div className="grid grid-cols-3 gap-8 max-w-md text-foreground/90 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent">2,847</div>
                <div className="text-sm font-medium mt-1">Stories Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent">156</div>
                <div className="text-sm font-medium mt-1">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent">1,234</div>
                <div className="text-sm font-medium mt-1">Story Swappers</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Phone Mockup */}
          <div className="hidden lg:block relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
            
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-full blur-2xl opacity-30"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-primary-glow mr-2" />
                  <span className="font-heading text-foreground font-medium">Story Swap</span>
                </div>
                <div className="flex space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400" />
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-white/5 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3 shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium font-heading">Discover Paris</div>
                    <div className="text-xs text-foreground/60">Hidden gems & local favorites</div>
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-br from-gray-700/50 to-gray-900/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073')] bg-cover bg-center"></div>
                  <MapPin className="w-8 h-8 text-primary-glow/70" />
                </div>
                <div className="text-xs text-foreground/60">Explore 24 authentic stories from locals</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-foreground font-medium">Popular Cities</div>
                <div className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent font-medium">View All</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;