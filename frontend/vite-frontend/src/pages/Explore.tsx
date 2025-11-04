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
    // Force fresh fetch on component mount
    fetchStories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Add a separate effect to refetch when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStories();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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
      {/* Header with Premium Styling */}
      <div className="text-white py-12" style={{ background: 'linear-gradient(135deg, hsl(215, 30%, 12%) 0%, hsl(215, 30%, 18%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'hsl(0, 0%, 95%)' }}>Explore Stories</h1>
              <p className="text-xl max-w-2xl" style={{ color: 'hsl(0, 0%, 85%)' }}>
                Discover authentic local experiences from storytellers around the world
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/20 hover:text-white shadow-lg transition-all"
                onClick={() => fetchStories()}
                disabled={loading}
              >
                <Search className="mr-2 h-5 w-5" />
                {loading ? 'Refreshing...' : 'Refresh Stories'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/20 hover:text-white shadow-lg transition-all"
                onClick={() => setShowMap(!showMap)}
              >
                <MapIcon className="mr-2 h-5 w-5" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
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
            <SelectTrigger className="w-full md:w-48 bg-slate-800/80 border-slate-700 text-white hover:bg-slate-800">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">All Stories</SelectItem>
              <SelectItem value="food" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Food</SelectItem>
              <SelectItem value="music" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Music</SelectItem>
              <SelectItem value="history" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">History</SelectItem>
              <SelectItem value="culture" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Culture</SelectItem>
              <SelectItem value="nightlife" className="hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Nightlife</SelectItem>
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
                <Card key={story._id} className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={storyImage} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                          {"Culture"}
                        </Badge>
                        {story.tags.slice(0, 1).map(tag => (
                          <Badge key={tag} variant="outline" className="bg-black/30 text-white border-white/20 backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2 group-hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">{story.title}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                        <span className="text-sm text-muted-foreground truncate">
                          {story.location.address.formatted || "Global"}
                        </span>
                      </CardDescription>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        <span>by</span>
                        <span className="font-semibold text-primary">{story.author.displayName}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4 flex-grow flex flex-col group-hover:bg-muted/30 transition-colors">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {story.content.snippet}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                          <img 
                            src={story.author.avatar?.url || avatarPlaceholder} 
                            alt={story.author.displayName}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        </div>
                        <span className="text-sm font-medium">{story.author.displayName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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