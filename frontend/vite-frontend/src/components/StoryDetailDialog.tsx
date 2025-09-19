import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye, MapPin, Calendar, User } from "lucide-react";
import { handleImageError } from "@/utils/imageUtils";

interface Story {
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
  author?: string;
}

interface StoryDetailDialogProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
}

const StoryDetailDialog = ({ story, isOpen, onClose }: StoryDetailDialogProps) => {
  if (!story) return null;

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

  // Sample full content for demonstration
  const sampleContent = story.fullContent || `
    ${story.excerpt}
    
    This is where the full story content would be displayed. In a real application, this would contain the complete narrative that the user wrote when they submitted their story.
    
    The story might include:
    • Detailed descriptions of the location
    • Personal anecdotes and experiences
    • Tips and recommendations for other visitors
    • Historical context or background information
    • Photos and visual elements
    
    For now, this is sample content to demonstrate how the story detail view would work. Each story would have its own unique content based on what the author originally submitted.
    
    This particular story about "${story.title}" in ${story.location} has received ${story.likes} likes and ${story.comments} comments from the community, showing how much people appreciate local stories and hidden gems.
    
    The author shared this story on ${new Date(story.createdAt).toLocaleDateString()}, and it has been viewed ${story.views} times since then.
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{story.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {story.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(story.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {story.author || "You"}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(story.status)}>
              {story.status}
            </Badge>
          </div>
        </DialogHeader>

        {story.image && (
          <div className="mb-6">
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Story Content */}
          <div className="prose max-w-none">
            <DialogDescription className="text-base leading-relaxed whitespace-pre-line">
              {sampleContent}
            </DialogDescription>
          </div>

          {/* Story Stats */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {story.likes} likes
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {story.comments} comments
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {story.views} views
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                // Navigate to edit mode - we'll implement this
                console.log("Edit story:", story.id);
                onClose();
              }}>
                Edit Story
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryDetailDialog;