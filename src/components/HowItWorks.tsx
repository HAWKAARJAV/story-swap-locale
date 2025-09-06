import { MapPin, BookOpen, Users, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Drop Your Pin",
      description: "Share a story tied to a specific location - a hidden café, a street corner memory, or a local tradition.",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      title: "Swap to Unlock",
      description: "To read others' stories, you need to contribute one yourself. Fair exchange builds our community.",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Connect & Discover",
      description: "Meet fellow explorers, locals with insider knowledge, and travelers with unique perspectives.",
      color: "text-accent"
    },
    {
      icon: Trophy,
      title: "Earn Your Badges",
      description: "Become a Story Master, City Explorer, or Community Champion as you contribute and engage.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            How Story Swap Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a global community of storytellers and discover the hidden narratives that make every place special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto ${step.color} bg-muted/50 rounded-2xl flex items-center justify-center mb-4 transform transition-transform hover:scale-110`}>
                  <step.icon className="h-10 w-10" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden lg:block relative mt-12">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;