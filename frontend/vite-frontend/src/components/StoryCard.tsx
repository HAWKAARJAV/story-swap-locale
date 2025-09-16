import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, MessageCircle, Lock, Unlock, Star } from "lucide-react";
import { useState } from "react";

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    excerpt: string;
    location: string;
    author: {
      name: string;
      avatar?: string;
      badge?: string;
    };
    tags: string[];
    likes: number;
    comments: number;
    isLocked: boolean;
    isLiked: boolean;
    image?: string;
  };
  onSwapToUnlock?: () => void;
}

const StoryCard = ({ story, onSwapToUnlock }: StoryCardProps) => {
  const [isLiked, setIsLiked] = useState(story.isLiked);
  const [likes, setLikes] = useState(story.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="story-card bg-card-gradient rounded-2xl p-6 border border-border/50 relative overflow-hidden">
      {/* Story Image */}
      {story.image && (
        <div className="w-full h-48 bg-muted rounded-xl mb-4 overflow-hidden">
          <img 
            src={story.image} 
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Author & Location */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={story.author.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {story.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{story.author.name}</span>
              {story.author.badge && (
                <Star className="h-3 w-3 text-accent fill-current" />
              )}
            </div>
            <div className="flex items-center text-muted-foreground text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {story.location}
            </div>
          </div>
        </div>

        {/* Lock Status */}
        <div className="text-muted-foreground">
          {story.isLocked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4 text-primary" />
          )}
        </div>
      </div>

      {/* Story Content */}
      <div className={`story-unlock ${story.isLocked ? 'locked' : ''}`}>
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">
          {story.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {story.excerpt}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {story.tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="text-xs bg-secondary/20 text-secondary hover:bg-secondary/30"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`p-0 h-auto ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{story.comments}</span>
          </Button>
        </div>

        {story.isLocked ? (
          <Button 
            size="sm" 
            onClick={onSwapToUnlock}
            className="btn-glow"
          >
            <Lock className="h-3 w-3 mr-2" />
            Swap to Unlock
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            Read Full Story
          </Button>
        )}
      </div>

      {/* Locked Overlay */}
      {story.isLocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none rounded-2xl" />
      )}
    </div>
  );
};

export default StoryCard;