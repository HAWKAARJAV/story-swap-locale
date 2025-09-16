import StoryCard from "./StoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import jazzClubImage from "@/assets/jazz-club.jpg";
import parisCafeImage from "@/assets/paris-cafe.jpg";
import communityFoodImage from "@/assets/community-food.jpg";

const FeaturedStories = () => {
  const featuredStories = [
    {
      id: "1",
      title: "The Secret Jazz Club Behind the Bookstore",
      excerpt: "Every Thursday night, a hidden door opens in the back of Chennai's oldest bookstore, revealing a world of underground jazz that's been thriving since the 1970s...",
      location: "Chennai, India",
      author: {
        name: "Priya Sharma",
        badge: "Local Guide"
      },
      tags: ["Music", "Hidden Gems", "Culture"],
      likes: 47,
      comments: 12,
      isLocked: false,
      isLiked: false,
      image: jazzClubImage
    },
    {
      id: "2",
      title: "Where Hemingway Wrote His Last Letter",
      excerpt: "In a quiet corner of this Paris café, Ernest Hemingway penned what would become his final correspondence. The owner still keeps the table exactly as it was...",
      location: "Paris, France",
      author: {
        name: "Marcus Chen",
        badge: "Story Master"
      },
      tags: ["Literary", "History", "Café Culture"],
      likes: 89,
      comments: 24,
      isLocked: true,
      isLiked: false,
      image: parisCafeImage
    },
    {
      id: "3",
      title: "The Grandmother's Recipe That United a Neighborhood",
      excerpt: "When Mrs. Rodriguez started sharing her tamales during the pandemic, she had no idea it would bring together a community that had been divided for years...",
      location: "Mexico City, Mexico",
      author: {
        name: "Sofia Martinez"
      },
      tags: ["Food", "Community", "Heartwarming"],
      likes: 156,
      comments: 33,
      isLocked: true,
      isLiked: true,
      image: communityFoodImage
    }
  ];

  const handleSwapToUnlock = () => {
    // This would trigger the story submission flow
    console.log("Opening story submission...");
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Featured Stories from Our Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover authentic local experiences and hidden gems shared by fellow travelers and locals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredStories.map((story, index) => (
            <div 
              key={story.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <StoryCard 
                story={story} 
                onSwapToUnlock={handleSwapToUnlock}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="btn-glow">
            Explore All Stories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;