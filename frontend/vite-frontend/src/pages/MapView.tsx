import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, Heart, MessageCircle } from "lucide-react";
import Map from "@/components/Map";
import { getLocationCoordinates, calculateCenter, calculateZoom, LocationCoordinates } from "@/utils/locationUtils";
import { storyImages, handleImageError } from "@/utils/imageUtils";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  location: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  author: string;
  image?: string;
}

const MapView = () => {
  const [stories] = useState<Story[]>([
    {
      id: "1",
      title: "My Hidden Coffee Spot in Brooklyn",
      excerpt: "Found this amazing little café that serves the best cortado I've ever had...",
      location: "Brooklyn, NY",
      tags: ["Coffee", "Hidden Gems", "NYC"],
      likes: 23,
      comments: 8,
      views: 156,
      author: "Sarah M.",
      image: storyImages.brooklyn
    },
    {
      id: "2",
      title: "The Street Art Tour I Created",
      excerpt: "After years of exploring murals in my neighborhood, I decided to create my own walking tour...",
      location: "Austin, TX",
      tags: ["Art", "Walking Tours", "Community"],
      likes: 45,
      comments: 12,
      views: 234,
      author: "Mike D.",
      image: storyImages.austin
    },
    {
      id: "3",
      title: "Grandfather's Secret Fishing Spot",
      excerpt: "A secluded lake where my grandfather taught me patience...",
      location: "Lake Tahoe, CA",
      tags: ["Family", "Nature", "Memories"],
      likes: 18,
      comments: 5,
      views: 89,
      author: "Alex J.",
      image: storyImages.tahoe
    },
    {
      id: "4",
      title: "Best Food Truck in Seattle",
      excerpt: "This Korean-Mexican fusion truck changed my lunch game forever...",
      location: "Seattle, WA",
      tags: ["Food", "Street Food", "Fusion"],
      likes: 67,
      comments: 23,
      views: 345,
      author: "Jenny K.",
      image: storyImages.seattle
    },
    {
      id: "5",
      title: "Portland's Hidden Bookstore Café",
      excerpt: "A magical place where books meet coffee in perfect harmony...",
      location: "Portland, OR",
      tags: ["Books", "Coffee", "Portland"],
      likes: 34,
      comments: 9,
      views: 178,
      author: "David L.",
      image: storyImages.portland
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({ lat: 39.8283, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);
  const [markers, setMarkers] = useState<Array<{
    position: LocationCoordinates;
    title: string;
    content: string;
  }>>([]);

  useEffect(() => {
    // Calculate map markers and bounds
    const validLocations: LocationCoordinates[] = [];
    const mapMarkers: Array<{
      position: LocationCoordinates;
      title: string;
      content: string;
    }> = [];

    stories.forEach(story => {
      const coordinates = getLocationCoordinates(story.location);
      if (coordinates) {
        validLocations.push(coordinates);
        mapMarkers.push({
          position: coordinates,
          title: story.title,
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-semibold text-sm mb-1">${story.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${story.excerpt.substring(0, 100)}...</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>by ${story.author}</span>
                <div class="flex space-x-2">
                  <span>❤️ ${story.likes}</span>
                  <span>💬 ${story.comments}</span>
                </div>
              </div>
            </div>
          `
        });
      }
    });

    if (validLocations.length > 0) {
      setMapCenter(calculateCenter(validLocations));
      setMapZoom(calculateZoom(validLocations));
    }

    setMarkers(mapMarkers);
  }, [stories]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Header */}
      <div className="text-white py-12" style={{ background: 'linear-gradient(135deg, hsl(215, 30%, 12%) 0%, hsl(215, 30%, 18%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Story Map</h1>
          <p className="text-xl text-white/90">
            Discover stories from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Story Locations
                </CardTitle>
                <CardDescription>
                  Click on markers to see story details
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] p-4">
                <Map
                  center={mapCenter}
                  zoom={mapZoom}
                  markers={markers}
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Story List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Featured Stories</h2>
            {stories.map(story => (
              <Card 
                key={story.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedStory?.id === story.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedStory(story)}
              >
                {story.image && (
                  <div className="relative">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                      onError={handleImageError}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm line-clamp-2">{story.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {story.location}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {story.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {story.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {story.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {story.author}</span>
                    <div className="flex space-x-3">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {story.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {story.comments}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {story.views}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Story Details */}
        {selectedStory && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>{selectedStory.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedStory.location}
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Story
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{selectedStory.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;