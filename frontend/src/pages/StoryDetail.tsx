import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, MessageCircle, Share2, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarPlaceholder, handleImageError, storyImages } from "@/utils/imageUtils";
import { apiService, Story } from "@/lib/api";

const StoryDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      const storyId = searchParams.get('id') || searchParams.get('storyId');
      const storyData = searchParams.get('data');

      if (storyId) {
        const response = await apiService.getStoryById(storyId);
        if (response.data) {
          setStory(response.data);
          setLoading(false);
          return;
        }
      }

      if (storyData) {
        try {
          const parsedStory = JSON.parse(decodeURIComponent(storyData));
          setStory(parsedStory);
        } catch (error) {
          console.error('Error parsing story data:', error);
          navigate('/explore');
        }
      } else if (!storyId) {
        navigate('/explore');
      }

      setLoading(false);
    };

    loadStory();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(215, 20%, 18%)' }}>
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center" style={{ backgroundColor: 'hsl(215, 20%, 18%)' }}>
        <div>
          <h1 className="text-2xl font-semibold text-white mb-3">Story unavailable</h1>
          <p className="text-white/70 mb-6">This story could not be loaded.</p>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  const heroImage =
    story.content?.media?.find((media) => media.type === 'image')?.url ||
    storyImages.delhi;
  const storyBody = story.content?.text?.body || story.content?.snippet || 'No content available.';

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'hsl(215, 20%, 18%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hero Image */}
        {heroImage && (
          <div className="relative w-full h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={heroImage}
              alt={story.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Story Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {story.title}
              </h1>
              <div className="flex items-center text-white/90 gap-2">
                <MapPin className="h-5 w-5" />
                    <span className="text-lg">{story.location?.address?.formatted || 'Unknown Location'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarImage src={story.author?.avatar?.url || story.author?.avatar || avatarPlaceholder} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                  {(story.author?.displayName || story.author?.name || 'A').split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">{story.author?.displayName || story.author?.name || 'Anonymous'}</h3>
                  {story.author?.badge && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      {story.author.badge}
                    </Badge>
                  )}
                </div>
                {story.metadata?.readingTime && (
                  <div className="flex items-center text-white/70 text-sm mt-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {story.metadata.readingTime} min read
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-white/80 hover:text-red-400 transition-colors">
                <Heart className="h-5 w-5" />
                <span>{story.engagement?.likes || story.likes || 0}</span>
              </button>
              <button className="flex items-center gap-2 text-white/80 hover:text-blue-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>{story.engagement?.comments || story.comments || 0}</span>
              </button>
              <button className="flex items-center gap-2 text-white/80 hover:text-green-400 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {story.tags?.map((tag: any, index: number) => {
            const tagText = typeof tag === 'string' ? tag : (tag.displayName || tag.name || '');
            const tagKey = typeof tag === 'string' ? tag : tag._id;
            return (
              <Badge
                key={tagKey || index}
                variant="secondary"
                className="text-sm bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors"
              >
                {tagText}
              </Badge>
            );
          })}
        </div>

        {/* Story Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <div className="prose prose-lg prose-invert max-w-none">
            {storyBody ? (
              storyBody.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-white/90 text-lg leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-white/90 text-lg leading-relaxed">No content available.</p>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            onClick={() => navigate('/submit')}
          >
            Share Your Story
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate('/explore')}
          >
            Explore More Stories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
