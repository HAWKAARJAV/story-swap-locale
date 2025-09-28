import { MapPin, BookOpen, Users, Trophy, Sparkles, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Share Your Adventure",
      description: "Drop a pin on the map and share your unique story about that place. Every location has hidden gems waiting to be discovered.",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-primary to-primary/80"
    },
    {
      icon: BookOpen,
      title: "Unlock Stories",
      description: "Exchange your story to unlock others' experiences. Discover local secrets, hidden spots, and authentic travel tales from fellow explorers.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-secondary to-secondary/80"
    },
    {
      icon: Users,
      title: "Connect Globally",
      description: "Join a vibrant community of travelers and locals. Share experiences, get recommendations, and build lasting connections worldwide.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-accent to-accent/80"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 text-secondary">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of travelers and locals sharing authentic stories. 
            Discover hidden gems and create meaningful connections through the art of storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group card-tilt bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden animate-slide-up border border-muted/20"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Beautiful Image Header with Parallax Effect */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${step.gradient} opacity-70 group-hover:opacity-50 transition-opacity duration-500`} />
                

                
                {/* Enhanced Step Number */}
                <div className="absolute top-6 left-6 w-14 h-14 glass-enhanced text-white rounded-2xl text-xl font-bold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                
                {/* Enhanced Icon */}
                <div className="absolute bottom-6 right-6 w-16 h-16 glass-enhanced rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                  <step.icon className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center px-8 py-4 glass-enhanced border border-primary/30 rounded-2xl text-primary font-semibold text-lg shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Sparkles className="mr-3 h-5 w-5 animate-pulse" />
            Ready to start your story journey?
            <ArrowRight className="ml-3 h-5 w-5 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;