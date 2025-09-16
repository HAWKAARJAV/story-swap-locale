import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedStories from "../components/FeaturedStories";

const Index = () => {
  return (
    <main className="pt-16">
      <HeroSection />
      <HowItWorks />
      <FeaturedStories />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of storytellers who are building the world's most authentic travel and local discovery platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary hover:bg-white/90 font-semibold py-4 px-8 rounded-xl btn-glow transition-all">
              Start Your Journey
            </button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-primary-glow">Story Swap</h3>
              <p className="text-background/70 mb-4">
                Connecting the world through authentic local stories and shared experiences.
              </p>
              <div className="flex space-x-4">
                <span className="text-background/50">Follow us:</span>
                <a href="#" className="text-background/70 hover:text-primary-glow">Twitter</a>
                <a href="#" className="text-background/70 hover:text-primary-glow">Instagram</a>
                <a href="#" className="text-background/70 hover:text-primary-glow">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-primary-glow">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary-glow">Safety</a></li>
                <li><a href="#" className="hover:text-primary-glow">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-primary-glow">Our Mission</a></li>
                <li><a href="#" className="hover:text-primary-glow">Contact</a></li>
                <li><a href="#" className="hover:text-primary-glow">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50">
            <p>&copy; 2024 Story Swap. Building community through shared stories.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
