import { MapPin, BookOpen, Users, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Drop Your Pin",
      description: "Share a story tied to a specific location - a hidden café, a street corner memory, or a local tradition.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: BookOpen,
      title: "Swap to Unlock",
      description: "To read others' stories, you need to contribute one yourself. Fair exchange builds our community.",
      color: "from-primary to-purple-500"
    },
    {
      icon: Users,
      title: "Connect & Discover",
      description: "Meet fellow explorers, locals with insider knowledge, and travelers with unique perspectives.",
      color: "from-accent to-yellow-400"
    },
    {
      icon: Trophy,
      title: "Earn Your Badges",
      description: "Become a Story Master, City Explorer, or Community Champion as you contribute and engage.",
      color: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-glow text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="font-heading tracking-wider">THE PROCESS</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-glow to-accent">Story Swap</span> Works
          </h2>
          
          <p className="font-body text-lg text-foreground/80 max-w-2xl mx-auto">
            Join a global community of storytellers and discover the hidden narratives that make every place special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-bold flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg shadow-primary/20`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="font-heading text-xl font-bold mb-3">
                  {step.title}
                </h3>
                
                <p className="font-body text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 font-semibold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;