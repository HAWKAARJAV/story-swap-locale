import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bot, MapPin, Heart, Calendar, User, Loader2, MessageCircle, Send } from 'lucide-react';
import { agentXService, type ChatResponse } from '@/lib/agentx';

interface TripPlan {
  destination: string;
  itinerary: string[];
  vibe: string;
  quote: string;
  estimatedDuration: string;
  bestSeason: string;
  emotionalTone: string;
}

interface UserMood {
  current: string;
  previousStories: string[];
  preferences: string[];
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const TravelPlanner = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [userMood, setUserMood] = useState<UserMood>({
    current: '',
    previousStories: [],
    preferences: []
  });
  const [agentXReady, setAgentXReady] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    // Initialize AgentX service
    const initializeAgentX = async () => {
      const apiKey = import.meta.env.VITE_AGENTX_KEY || '68e364e6585958bf1781cff5dizVVs46LfZvd8oe11yUvw==|yFrngg+/wvLgTbN7EDiZgHOJcAQ7oWeq4BGxNb4HVug=';
      await agentXService.initialize(apiKey);
      setAgentXReady(agentXService.isReady());
    };

    initializeAgentX();
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      // Demo data based on user
      if (user?.displayName === 'Hawk') {
        setUserMood({
          current: 'adventurous exploration',
          previousStories: ['Mountain trekking in Ladakh', 'Desert camping in Rajasthan'],
          preferences: ['mountains', 'adventure', 'remote locations']
        });
      } else if (user?.displayName === 'Aarjav') {
        setUserMood({
          current: 'cultural discovery',
          previousStories: ['Street food tour in Mumbai', 'Heritage walk in Jaipur'],
          preferences: ['culture', 'food', 'history']
        });
      } else {
        setUserMood({
          current: 'peaceful retreat',
          previousStories: ['Beach sunset in Goa', 'Hill station in Munnar'],
          preferences: ['nature', 'relaxation', 'scenic beauty']
        });
      }
    } catch (error) {
      console.log('Using default travel context');
    }
  };

  const generateTripPlan = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with demo response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoPlans = {
        'adventure': {
          destination: "Spiti Valley, Himachal Pradesh",
          itinerary: ["Key Monastery", "Kibber Village", "Chicham Bridge", "Pin Valley National Park"],
          vibe: "quiet adventure",
          quote: "Where the wind teaches you to listen again.",
          estimatedDuration: "7 days",
          bestSeason: "May-October",
          emotionalTone: "contemplative discovery"
        },
        'peaceful': {
          destination: "Coorg, Karnataka",
          itinerary: ["Coffee plantations", "Abbey Falls", "Dubare Elephant Camp", "Raja's Seat"],
          vibe: "serene retreat",
          quote: "In the hills, time moves like morning mist.",
          estimatedDuration: "4 days",
          bestSeason: "October-March",
          emotionalTone: "peaceful rejuvenation"
        },
        'cultural': {
          destination: "Hampi, Karnataka",
          itinerary: ["Virupaksha Temple", "Vittala Temple", "Royal Enclosure", "Matanga Hill"],
          vibe: "historic immersion",
          quote: "Where stones whisper ancient stories.",
          estimatedDuration: "5 days",
          bestSeason: "November-February",
          emotionalTone: "mystical exploration"
        }
      };
      
      let selectedPlan = demoPlans.peaceful;
      if (currentMood.toLowerCase().includes('adventure')) {
        selectedPlan = demoPlans.adventure;
      } else if (currentMood.toLowerCase().includes('culture') || currentMood.toLowerCase().includes('history')) {
        selectedPlan = demoPlans.cultural;
      }
      
      setTripPlan(selectedPlan);
    } catch (error) {
      console.error('Error generating trip plan:', error);
    }
    setIsLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: chatInput,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Add context about user's mood and stories
      const contextualMessage = `${chatInput}\n\nContext: I'm interested in ${currentMood} experiences. My previous travel stories include: ${userMood.previousStories.join(', ')}. My travel preferences are: ${userMood.preferences.join(', ')}.`;
      
      const response = await agentXService.sendMessage(contextualMessage);
      
      if (response) {
        const assistantMessage: ChatMessage = {
          id: response.id,
          content: response.content,
          role: 'assistant',
          timestamp: response.timestamp
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: "I'd love to help you plan your next adventure! Based on your travel history, I can suggest some amazing destinations that match your style.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, fallbackMessage]);
    }

    setChatLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white mb-6">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">AI Travel Planner</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Next Story, {user?.displayName || 'Explorer'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From the stories you've shared to the adventures yet to come. 
            Let AI help you discover your next meaningful journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Context & Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Context Card */}
            {userMood.previousStories.length > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Travel DNA
                  </CardTitle>
                  <CardDescription>
                    Based on your previous stories and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recent Adventures</h4>
                      <div className="space-y-1">
                        {userMood.previousStories.map((story, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-1">
                            {story}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Travel Style</h4>
                      <div className="space-y-1">
                        {userMood.preferences.map((pref, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-1">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Input Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Tell AI About Your Mood
                </CardTitle>
                <CardDescription>
                  Share what kind of experience you're seeking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Mood</label>
                  <Input
                    placeholder="e.g., seeking adventure, need peaceful retreat, want cultural immersion"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Context</label>
                  <Textarea
                    placeholder="Tell us more about what you're looking for in your next journey..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={generateTripPlan}
                    disabled={isLoading || !currentMood}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" />Generate Plan</>
                    )}
                  </Button>
                  
                  {agentXReady && (
                    <Button 
                      onClick={() => setShowChat(!showChat)}
                      variant="outline"
                      className="px-4"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Results */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your Next Adventure
                </CardTitle>
                <CardDescription>
                  AI-curated travel plan based on your story
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tripPlan ? (
                  <div className="space-y-6">
                    {/* Destination */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                      <h3 className="text-2xl font-bold mb-2">{tripPlan.destination}</h3>
                      <p className="text-blue-100 italic">"{tripPlan.quote}"</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold">{tripPlan.estimatedDuration}</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="font-semibold">{tripPlan.vibe}</div>
                        <div className="text-sm text-gray-600">Vibe</div>
                      </div>
                    </div>

                    {/* Itinerary */}
                    <div>
                      <h4 className="font-semibold mb-3">Suggested Itinerary</h4>
                      <div className="space-y-2">
                        {tripPlan.itinerary.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Season */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <strong>Best Time to Visit:</strong> {tripPlan.bestSeason}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1" variant="outline">
                        Save Plan
                      </Button>
                      <Button className="flex-1" variant="outline">
                        Share Plan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Share your mood and let AI craft your perfect journey</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Chat */}
          {showChat && agentXReady && (
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    SoulTrip Assistant
                  </CardTitle>
                  <CardDescription>
                    Chat with your AI travel companion
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation about your travel dreams!</p>
                      </div>
                    )}
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about destinations, activities, or get travel advice..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || chatLoading}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* AgentX Integration Notice */}
        {agentXReady && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">SoulTrip AI Assistant is Ready</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Your AI travel companion is connected and ready to help plan personalized adventures based on your stories and preferences.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TravelPlanner;