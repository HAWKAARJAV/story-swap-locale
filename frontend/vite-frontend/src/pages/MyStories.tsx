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
import { apiService, Story } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const MyStories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);

  // Fetch user's stories
  const fetchMyStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMyStories();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setStories(response.data.stories);
      }
    } catch (err) {
      setError('Failed to load your stories');
      console.error('Error fetching my stories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {

    if (user) {
      fetchMyStories();
    }
    
    // Refetch when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        fetchMyStories();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Handler functions
  const handleViewStory = (story: Story) => {
    setSelectedStory(story);
    setShowDetailDialog(true);
  };

  const handleEditStory = (story: Story) => {
    navigate(`/edit-story/${story._id}`);
  };

  const handleDeleteStory = (story: Story) => {
    setStoryToDelete(story);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStory = () => {
    if (storyToDelete) {
      setStories(stories.filter(story => story._id !== storyToDelete._id));
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
      <div className="text-white py-12" style={{ background: 'linear-gradient(135deg, hsl(215, 30%, 12%) 0%, hsl(215, 30%, 18%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">My Stories</h1>
              <p className="text-xl text-white/90">
                {user ? `${user.displayName}'s published stories` : 'Manage and track your published stories'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 hover:text-white"
                onClick={() => fetchMyStories()}
                disabled={loading}
              >
                <Eye className="mr-2 h-5 w-5" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
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
                {stories.reduce((sum, story) => sum + story.engagement.likes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {stories.reduce((sum, story) => sum + story.engagement.views, 0)}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your stories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <h3 className="text-lg font-semibold mb-2">Unable to load stories</h3>
              <p>{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story._id} className="story-card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {/* Use a placeholder image since API stories might not have images */}
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-blue-500 opacity-50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                </div>
                
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
                    {story.content.snippet || story.content.text.body.substring(0, 150) + '...'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {story.location.address.city}, {story.location.address.state}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.length > 0 ? story.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    )) : (
                      <Badge variant="outline" className="text-xs opacity-50">
                        No tags
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {story.engagement.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {story.engagement.comments}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {story.engagement.views}
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
        )}

        {/* Empty State */}
        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
              <p>
                {user?.displayName === 'John Doe' || user?.displayName === 'New User' 
                  ? 'You haven\'t uploaded any stories yet. Start sharing your adventures!'
                  : `${user?.displayName || 'You'} haven't uploaded any stories to this account yet.`
                }
              </p>
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