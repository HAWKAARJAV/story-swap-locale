import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce-gentle">
        <MapPin className="h-8 w-8 text-primary-glow/60" />
      </div>
      <div className="absolute top-40 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
        <BookOpen className="h-6 w-6 text-secondary/60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
        <Users className="h-7 w-7 text-accent/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Swap Stories,
            <br />
            <span className="text-accent">Discover Cities</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Share your local adventures and unlock authentic stories from travelers and locals around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-glow bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto">
              <MapPin className="mr-2 h-5 w-5" />
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto">
              <BookOpen className="mr-2 h-5 w-5" />
              Share Your Story
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-white/90">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2,847</div>
              <div className="text-sm">Stories Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-sm">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1,234</div>
              <div className="text-sm">Story Swappers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;