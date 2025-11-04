import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Star, Edit, Calendar, Heart, Eye } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@example.com", 
    avatar: "/placeholder.svg",
    bio: "Digital nomad sharing stories from around the world. Love discovering hidden gems and local culture.",
    location: "Currently in Bangkok, Thailand",
    joinDate: "January 2024",
    storiesContributed: 12,
    storiesUnlocked: 45,
    totalLikes: 234,
    badges: ["New Member", "Story Master", "City Explorer", "Culture Seeker"]
  });

  const [userStories, setUserStories] = useState([
    {
      id: "1",
      title: "The Secret Rooftop Garden in Bangkok",
      location: "Bangkok, Thailand", 
      likes: 45,
      views: 120,
      date: "2 days ago",
      tags: ["hidden gem", "nature", "city"]
    },
    {
      id: "2", 
      title: "Late Night Pho Culture in Saigon",
      location: "Ho Chi Minh City, Vietnam",
      likes: 67,
      views: 89,
      date: "1 week ago", 
      tags: ["food", "culture", "nightlife"]
    }
  ]);

  const [favoriteStories, setFavoriteStories] = useState([
    {
      id: "3",
      title: "The Jazz Club of Montmartre", 
      location: "Paris, France",
      author: "Marie Dubois",
      savedDate: "3 days ago"
    },
    {
      id: "4",
      title: "Grandmother's Curry Recipe",
      location: "Chennai, India", 
      author: "Raj Patel",
      savedDate: "1 week ago"
    }
  ]);

  const badgeColors = {
    "New Member": "bg-green-100 text-green-800",
    "Story Master": "bg-purple-100 text-purple-800", 
    "City Explorer": "bg-blue-100 text-blue-800",
    "Culture Seeker": "bg-orange-100 text-orange-800"
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Profile Header */}
      <div className="text-white py-16" style={{ background: 'linear-gradient(135deg, hsl(215, 30%, 12%) 0%, hsl(215, 30%, 18%) 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-white/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-white/10 text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/90 mb-2">{user.bio}</p>
              <div className="flex items-center text-white/80 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {user.badges.map((badge) => (
                  <Badge 
                    key={badge} 
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
              
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-primary">{user.storiesContributed}</div>
              <div className="text-sm text-muted-foreground">Stories Shared</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-secondary">{user.storiesUnlocked}</div>
              <div className="text-sm text-muted-foreground">Stories Unlocked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-accent">{user.totalLikes}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-primary">{user.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories">My Stories</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          {/* My Stories */}
          <TabsContent value="stories" className="space-y-4">
            {userStories.map((story) => (
              <Card key={story.id} className="story-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.location}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        {story.date}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                    <div className="flex gap-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites" className="space-y-4">
            {favoriteStories.map((story) => (
              <Card key={story.id} className="story-card">
                <CardHeader>
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {story.location}
                      <span className="mx-2">•</span>
                      by {story.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Saved {story.savedDate}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <Card key={badge} className="story-card">
                  <CardContent className="flex items-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge}</h3>
                      <p className="text-sm text-muted-foreground">
                        {badge === "New Member" && "Welcome to the community!"}
                        {badge === "Story Master" && "Shared 10+ stories"}
                        {badge === "City Explorer" && "Visited 5+ cities"}
                        {badge === "Culture Seeker" && "Focused on cultural stories"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;