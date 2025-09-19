import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Heart, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StoryDetailDialog from "@/components/StoryDetailDialog";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { storyImages, handleImageError } from "@/utils/imageUtils";

interface UserStory {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  location: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  status: "published" | "draft" | "pending";
  createdAt: string;
  image?: string;
}

const MyStories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<UserStory[]>([
    {
      id: "1",
      title: "My Hidden Coffee Spot in Brooklyn",
      excerpt: "Found this amazing little café that serves the best cortado I've ever had...",
      fullContent: `Found this amazing little café that serves the best cortado I've ever had...

It was a rainy Thursday morning when I first discovered "Bean & Gone," tucked away in a narrow alley between two residential buildings in Park Slope. The exterior is so unassuming that I'd walked past it dozens of times without noticing.

The interior is cozy with just eight seats - four at the counter and two small tables. The owner, Maria, has been roasting her own beans for over fifteen years. She sources directly from small farms in Colombia and Guatemala, and you can taste the difference immediately.

What makes this place special:
• The cortado is perfectly balanced - not too milky, with the espresso still prominent
• They only serve pastries from a local bakery that delivers fresh every morning  
• Maria remembers everyone's order after just two visits
• The wifi is fast, but there's an unspoken two-hour limit during busy times
• They have a small shelf of books that customers can borrow or trade

The prices are incredibly reasonable for NYC - $3.50 for a cortado that would cost $6 at a chain. They only accept cash, but there's an ATM around the corner.

If you're planning to visit, the best times are mid-morning (9-11 AM) or late afternoon (3-5 PM). They close at 4 PM on weekdays and are closed weekends - Maria says this is to maintain work-life balance, which I deeply respect.

This place has become my weekly ritual. Every Thursday, I grab my usual cortado and almond croissant, sit at the counter, and start my day right. It's these small discoveries that make living in Brooklyn so rewarding.`,
      location: "Brooklyn, NY",
      tags: ["Coffee", "Hidden Gems", "NYC"],
      likes: 23,
      comments: 8,
      views: 156,
      status: "published",
      createdAt: "2024-03-15",
      image: storyImages.brooklyn
    },
    {
      id: "2",
      title: "The Street Art Tour I Created",
      excerpt: "After years of exploring murals in my neighborhood, I decided to create my own walking tour...",
      fullContent: `After years of exploring murals in my neighborhood, I decided to create my own walking tour...

Living in East Austin for five years, I've watched the street art scene evolve dramatically. What started as a few scattered pieces has become one of the most vibrant outdoor galleries in Texas. After countless solo walks documenting these works, I realized I had enough material for a proper tour.

The "East Austin Mural Mile" covers 12 significant pieces across a 2-mile walking route:

**Stop 1: The "Greetings from Austin" Mural**
Location: South First & Annie Street
This iconic postcard-style mural is perfect for photos. Created by Todd Sanders and Rylsee, it's been updated three times since 2010.

**Stop 2: The Hope Outdoor Gallery Tribute**
Location: East 6th Street
When the original Hope Gallery closed, local artists recreated some of its most beloved pieces here. It's a beautiful homage to Austin's creative resilience.

**Stop 3: The "You're My Butter Half" Mural**
Location: Lamar & Barton Springs
This playful piece by artist Mel has become a favorite for couples' photos. The message is simple but the execution is flawless.

**Stops 4-12**: The tour continues through lesser-known gems, including political murals, abstract pieces, and community-collaborative works.

What I've learned creating this tour:
• Many murals have permission from property owners - it's not all "illegal" graffiti
• Artists often return to touch up their work seasonally
• The stories behind the art are just as important as the visuals
• Property development threatens these spaces constantly

I started leading this tour informally for friends, then began posting on social media. Now I have 200+ followers who join my monthly walks. No charge - I just love sharing these discoveries.

The best part? Artists sometimes join us when they see the group. I've met the creators of half these murals through the tours, and their insights add incredible depth to the experience.

If you're interested in joining the next tour, follow @EastAustinMurals on Instagram. We meet the first Saturday of each month at 10 AM at Radio Coffee on Barton Springs Road.`,
      location: "Austin, TX",
      tags: ["Art", "Walking Tours", "Community"],
      likes: 45,
      comments: 12,
      views: 234,
      status: "published",
      createdAt: "2024-03-10",
      image: storyImages.austin
    },
    {
      id: "3",
      title: "Grandfather's Secret Fishing Spot",
      excerpt: "Draft story about the secluded lake where my grandfather taught me patience...",
      fullContent: `Draft story about the secluded lake where my grandfather taught me patience...

This is still a work in progress, but I wanted to capture these memories before they fade. Grandpa Joe passed away last year, and I'm only now ready to write about our special place.

Hidden Creek Lake isn't on any tourist map. Located about 45 minutes from South Lake Tahoe, it requires a 2-mile hike through dense forest to reach. Grandpa discovered it in 1967 during a solo backpacking trip and kept it secret for over 50 years.

He first brought me there when I was eight years old. I remember being frustrated that we weren't going to the "real" lake where all the other families went. But when we emerged from the trees and saw this pristine mountain lake, perfectly still and reflecting the surrounding peaks, I understood why he protected this place.

The fishing rules according to Grandpa Joe:
• Never take more than two fish
• Always release the biggest catch
• No radios or loud talking - "Fish have good hearing"
• Pack out everything you bring in
• Tell no one except family

[This is where I need to add more details about our fishing techniques, the wildlife we saw, and the life lessons he taught me by that lake. I also want to include the story about the time we saw a family of deer drinking at the water's edge, and how Grandpa made me promise to never reveal the location to anyone outside the family.]

I'm planning to hike back there this summer - it will be my first time without him. I hope I can find it again; his directions were always more about intuition than landmarks.

This story needs more work, but it feels important to start getting these memories down. Maybe I'll finish it after my return visit.`,
      location: "Lake Tahoe, CA",
      tags: ["Family", "Nature", "Memories"],
      likes: 0,
      comments: 0,
      views: 0,
      status: "draft",
      createdAt: "2024-03-18"
    }
  ]);

  // Dialog states
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<UserStory | null>(null);

  // Handler functions
  const handleViewStory = (story: UserStory) => {
    setSelectedStory(story);
    setShowDetailDialog(true);
  };

  const handleEditStory = (story: UserStory) => {
    navigate(`/edit-story/${story.id}`);
  };

  const handleDeleteStory = (story: UserStory) => {
    setStoryToDelete(story);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStory = () => {
    if (storyToDelete) {
      setStories(stories.filter(story => story.id !== storyToDelete.id));
      toast({
        title: "Story Deleted",
        description: `"${storyToDelete.title}" has been permanently deleted.`,
        variant: "destructive",
      });
      setShowDeleteDialog(false);
      setStoryToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">My Stories</h1>
              <p className="text-xl text-white/90">
                Manage and track your published stories
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/submit')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Story
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {stories.filter(s => s.status === "published").length}
              </div>
              <div className="text-sm text-muted-foreground">Published Stories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {stories.reduce((sum, story) => sum + story.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {stories.reduce((sum, story) => sum + story.views, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {stories.filter(s => s.status === "draft").length}
              </div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="story-card overflow-hidden hover:shadow-lg transition-shadow">
              {story.image && (
                <div className="relative">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                  <div className="flex space-x-2 ml-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1"
                      onClick={() => handleEditStory(story)}
                      title="Edit story"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteStory(story)}
                      title="Delete story"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-3">
                  {story.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {story.location}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {story.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {story.comments}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {story.views}
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewStory(story)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
              <p>Start sharing your adventures with the community!</p>
            </div>
            <Button onClick={() => navigate('/submit')} className="mt-4">
              Write Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <StoryDetailDialog
        story={selectedStory}
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteStory}
        storyTitle={storyToDelete?.title || ""}
      />
    </div>
  );
};

export default MyStories;