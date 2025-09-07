import { useState, useEffect } from "react";
import { MapPin, Filter, Search, Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Explore = () => {
  const [stories, setStories] = useState([
    {
      id: "1",
      title: "The Secret Jazz Club of Montmartre",
      snippet: "Hidden beneath a Parisian bakery lies a speakeasy that transported me to 1920s jazz culture...",
      location: "Paris, France",
      author: "Marie Dubois",
      tags: ["music", "history", "nightlife"],
      likes: 42,
      views: 128,
      isLocked: false,
      image: "/src/assets/jazz-club.jpg"
    },
    {
      id: "2", 
      title: "Grandmother's Curry Recipe",
      snippet: "In a tiny lane in Chennai, an elderly woman taught me the secret to authentic Tamil curry...",
      location: "Chennai, India",
      author: "Raj Patel",
      tags: ["food", "culture", "family"],
      likes: 67,
      views: 203,
      isLocked: true,
      image: "/src/assets/community-food.jpg"
    },
    {
      id: "3",
      title: "Morning Coffee Ritual",
      snippet: "Every dawn at this corner café, locals gather not just for coffee but for stories...",
      location: "Melbourne, Australia", 
      author: "Sarah Kim",
      tags: ["coffee", "community", "morning"],
      likes: 89,
      views: 156,
      isLocked: true,
      image: "/src/assets/paris-cafe.jpg"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || story.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover authentic local experiences from storytellers around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="nightlife">Nightlife</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-card flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground">Map integration coming soon - explore stories visually</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="story-card overflow-hidden">
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                {story.isLocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                        🔒
                      </div>
                      <p className="text-sm font-medium">Swap to Unlock</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {story.location}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{story.title}</CardTitle>
                <CardDescription className={story.isLocked ? "blur-sm" : ""}>
                  {story.snippet}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">by {story.author}</span>
                  <div className="flex space-x-2">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {story.likes}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {story.views}
                    </span>
                  </div>
                  
                  {story.isLocked ? (
                    <Button size="sm" className="btn-glow">
                      Swap to Read
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm">Read Story</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No stories found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;