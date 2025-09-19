import { useState, useEffect } from "react";
import { MapPin, Filter, Search, Eye, Heart, Share2, Loader2, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService, Story } from "@/lib/api";
import { handleImageError, avatarPlaceholder, storyImages } from "@/utils/imageUtils";
import Map from "@/components/Map";
import { getLocationCoordinates, calculateCenter, calculateZoom, LocationCoordinates } from "@/utils/locationUtils";

const Explore = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({ lat: 39.8283, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: LocationCoordinates;
    title: string;
    content: string;
  }>>([]);

  useEffect(() => {
    fetchStories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    
    const response = await apiService.getStories({ limit: 20 });
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setStories(response.data.stories);
      updateMapData(response.data.stories);
    }
    
    setLoading(false);
  };

  const updateMapData = (storyList: Story[]) => {
    const validLocations: LocationCoordinates[] = [];
    const markers: Array<{
      position: LocationCoordinates;
      title: string;
      content: string;
    }> = [];

    storyList.forEach((story, index) => {
      // Try to get coordinates from story location
      let coordinates = null;
      
      if (story.location?.coordinates) {
        coordinates = {
          lat: story.location.coordinates[1], // GeoJSON format: [lng, lat]
          lng: story.location.coordinates[0]
        };
      } else if (story.location?.address?.formatted) {
        coordinates = getLocationCoordinates(story.location.address.formatted);
      }

      if (coordinates) {
        validLocations.push(coordinates);
        markers.push({
          position: coordinates,
          title: story.title,
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-semibold text-sm mb-1">${story.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${story.content.snippet?.substring(0, 100) || 'No description available'}...</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>by ${story.author.displayName}</span>
                <div class="flex space-x-2">
                  <span>❤️ ${story.engagement?.likes || 0}</span>
                  <span>💬 ${story.engagement?.comments || 0}</span>
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

    setMapMarkers(markers);
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.location.address.formatted.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || story.tags.some(tag => tag.toLowerCase() === filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Discover authentic local experiences from storytellers around the world
              </p>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="mr-2 h-5 w-5" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
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
        {/* Interactive Map */}
        {showMap && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Story Locations
              </CardTitle>
              <CardDescription>
                Click on markers to see story details • {filteredStories.length} stories shown
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-4">
              <Map
                center={mapCenter}
                zoom={mapZoom}
                markers={mapMarkers}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        )}        {/* Stories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading stories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error loading stories: {error}</div>
            <Button onClick={fetchStories}>Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => {
              // Get a demo image for the story - rotate through available images
              const storyImage = Object.values(storyImages)[index % Object.values(storyImages).length];
              
              return (
                <Card key={story._id} className="story-card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={storyImage} 
                      alt={story.title}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {story.location.address.city}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center space-x-2 text-white">
                        <div className="flex items-center bg-black/50 rounded-full px-2 py-1">
                          <Heart className="h-3 w-3 mr-1" />
                          <span className="text-xs">{story.engagement?.likes || 0}</span>
                        </div>
                        <div className="flex items-center bg-black/50 rounded-full px-2 py-1">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="text-xs">{story.engagement?.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {story.content.snippet}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={story.author.avatar?.url || avatarPlaceholder} 
                          alt={story.author.displayName}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={handleImageError}
                        />
                        <span className="text-sm text-muted-foreground">{story.author.displayName}</span>
                      </div>
                      <div className="flex space-x-2">
                        {story.tags.slice(0, 2).map((tag) => (
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
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <button className="flex items-center hover:text-primary transition-colors">
                          <Heart className="h-4 w-4 mr-1" />
                          {story.engagement?.likes || 0}
                        </button>
                        <button className="flex items-center hover:text-primary transition-colors">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredStories.length === 0 && (
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