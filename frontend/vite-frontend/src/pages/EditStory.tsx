import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoryFormData {
  title: string;
  excerpt: string;
  fullContent: string;
  location: string;
  tags: string[];
  status: "published" | "draft" | "pending";
}

const EditStory = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    excerpt: "",
    fullContent: "",
    location: "",
    tags: [],
    status: "draft"
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for demonstration - in real app, this would come from API
  useEffect(() => {
    if (storyId) {
      // Simulate loading story data
      const sampleStories = {
        "1": {
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
          status: "published" as const
        },
        "2": {
          title: "The Street Art Tour I Created",
          excerpt: "After years of exploring murals in my neighborhood, I decided to create my own walking tour...",
          fullContent: `After years of exploring murals in my neighborhood, I decided to create my own walking tour...

Living in East Austin for five years, I've watched the street art scene evolve dramatically. What started as a few scattered pieces has become one of the most vibrant outdoor galleries in Texas. After countless solo walks documenting these works, I realized I had enough material for a proper tour.`,
          location: "Austin, TX",
          tags: ["Art", "Walking Tours", "Community"],
          status: "published" as const
        },
        "3": {
          title: "Grandfather's Secret Fishing Spot",
          excerpt: "Draft story about the secluded lake where my grandfather taught me patience...",
          fullContent: `Draft story about the secluded lake where my grandfather taught me patience...

This is still a work in progress, but I wanted to capture these memories before they fade. Grandpa Joe passed away last year, and I'm only now ready to write about our special place.

Hidden Creek Lake isn't on any tourist map. Located about 45 minutes from South Lake Tahoe, it requires a 2-mile hike through dense forest to reach.`,
          location: "Lake Tahoe, CA",
          tags: ["Family", "Nature", "Memories"],
          status: "draft" as const
        }
      };

      const story = sampleStories[storyId as keyof typeof sampleStories];
      if (story) {
        setFormData(story);
      }
    }
  }, [storyId]);

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Story Updated",
        description: `"${formData.title}" has been successfully updated.`,
      });
      setIsLoading(false);
      navigate("/my-stories");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/my-stories");
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Header */}
      <div className="text-white py-8" style={{ background: 'linear-gradient(135deg, hsl(215, 30%, 12%) 0%, hsl(215, 30%, 18%) 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Stories
            </Button>
          </div>
          <h1 className="text-3xl font-bold mt-4">Edit Story</h1>
          <p className="text-white/90">Update your story details and content</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Story Content</CardTitle>
                  <CardDescription>
                    Update your story title, excerpt, and full content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter story title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Brief description of your story"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="fullContent">Full Content</Label>
                    <Textarea
                      id="fullContent"
                      value={formData.fullContent}
                      onChange={(e) => handleInputChange("fullContent", e.target.value)}
                      placeholder="Write your complete story here..."
                      rows={15}
                      className="min-h-[300px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Story Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Brooklyn, NY"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Add tags to help people discover your story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStory;