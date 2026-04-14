import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Heart, MessageCircle, MapPin, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StoryDetailDialog from "@/components/StoryDetailDialog";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { handleImageError } from "@/utils/imageUtils";
import { apiService, Story } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const MyStories = () => {
  const STORY_CACHE_KEY = "localelens:my-stories";
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
  const fetchMyStories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const response = await apiService.getMyStories();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setStories(response.data.stories);
        sessionStorage.setItem(STORY_CACHE_KEY, JSON.stringify(response.data.stories));
      }
    } catch (err) {
      setError('Failed to load your stories');
      console.error('Error fetching my stories:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    const cachedStories = sessionStorage.getItem(STORY_CACHE_KEY);
    if (cachedStories) {
      try {
        const parsedStories = JSON.parse(cachedStories) as Story[];
        if (parsedStories.length > 0) {
          setStories(parsedStories);
          setLoading(false);
        }
      } catch (error) {
        console.warn("Failed to hydrate cached user stories", error);
      }
    }

    if (user) {
      fetchMyStories(!cachedStories);
    }
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

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return;

    try {
      const response = await apiService.deleteStory(storyToDelete._id);

      if (response.error) {
        throw new Error(response.error);
      }

      // Remove from local state
      setStories(stories.filter(story => story._id !== storyToDelete._id));
      
      toast({
        title: "Story Deleted",
        description: `"${storyToDelete.title}" has been permanently deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete story',
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
      setStoryToDelete(null);
    }
  };

  const handlePublishStory = async (story: Story) => {
    try {
      const response = await apiService.publishStory(story._id);

      if (response.error) {
        throw new Error(response.error);
      }

      // Update the story in the list
      setStories(stories.map(s =>
        s._id === story._id ? { ...s, status: 'published', publishedAt: new Date().toISOString() } : s
      ));

      toast({
        title: "Story Published",
        description: `"${story.title}" is now live!`,
      });

      // Refetch from API after a moment to ensure consistency
      setTimeout(() => {
        fetchMyStories();
      }, 500);
    } catch (error) {
      console.error('Error publishing story:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to publish story',
        variant: "destructive"
      });
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
                className="border-white/30 text-white bg-transparent hover:bg-white/20 hover:text-white"
                onClick={() => fetchMyStories()}
                disabled={loading}
              >
                <Eye className="mr-2 h-5 w-5 text-current" />
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
                {stories.reduce((sum, story) => sum + (story.engagement?.likes || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {stories.reduce((sum, story) => sum + (story.engagement?.views || 0), 0)}
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
                  {story.content?.media?.find(media => media.type === 'image')?.url ? (
                    <img
                      src={story.content.media.find(media => media.type === 'image')?.url}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-blue-500 opacity-50" />
                    </div>
                  )}
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
                      {story.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 text-green-600 hover:text-green-700"
                          onClick={() => handlePublishStory(story)}
                          title="Publish story"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
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
                    {story.content?.snippet || `${story.content?.text?.body?.substring(0, 150) || ''}${story.content?.text?.body ? '...' : ''}` || 'No description available'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {story.location?.address?.city || 'Unknown City'}, {story.location?.address?.state || ''}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags?.length > 0 ? story.tags.map((tag) => {
                      // Handle both string tags and populated tag objects
                      const tagText = typeof tag === 'string' ? tag : (tag.displayName || tag.name || 'Tag');
                      const tagKey = typeof tag === 'string' ? tag : tag._id;
                      return (
                        <Badge key={tagKey} variant="outline" className="text-xs">
                          {tagText}
                        </Badge>
                      );
                    }) : (
                      <Badge variant="outline" className="text-xs opacity-50">
                        No tags
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {story.engagement?.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {story.engagement?.comments || 0}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {story.engagement?.views || 0}
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
          <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="text-muted-foreground mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2 text-foreground">No stories published yet</h3>
              <p className="max-w-xl mx-auto">
                Build your portfolio inside the product itself. Publish one strong, image-backed local story and this section becomes a much better recruiter demo.
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
