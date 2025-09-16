export interface User {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  city: string;
  state: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  preferences: {
    language: 'en' | 'hi';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    storiesShared: number;
    storiesUnlocked: number;
    totalLikes: number;
    totalComments: number;
    swapSuccessRate: number;
  };
  badges: Badge[];
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'banned';
  isVerified: boolean;
  joinedAt: string;
  lastActive: string;
}

export interface Story {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author: User;
  location: Location;
  coordinates: [number, number]; // [longitude, latitude]
  tags: Tag[];
  media?: Media[];
  language: 'en' | 'hi';
  isLocked: boolean;
  lockReason?: string;
  unlockRequirements?: {
    type: 'swap' | 'premium' | 'achievement';
    details: string;
  };
  likes: number;
  likedBy: string[]; // User IDs
  comments: Comment[];
  views: number;
  isPrivate: boolean;
  isFlagged: boolean;
  flagReasons?: string[];
  visibility: 'public' | 'city' | 'friends' | 'private';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Location {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'landmark' | 'neighborhood' | 'city' | 'custom';
  description?: string;
  storiesCount: number;
  isPopular: boolean;
  theme: CityTheme;
}

export interface Tag {
  _id: string;
  name: string;
  category: 'genre' | 'mood' | 'theme' | 'cultural' | 'language';
  color: string;
  description?: string;
  storiesCount: number;
  isPopular: boolean;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  storyId: string;
  parentId?: string; // For nested replies
  likes: number;
  likedBy: string[];
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Swap {
  _id: string;
  requester: User;
  targetStory: Story;
  offeredStory: {
    title: string;
    content: string;
    summary?: string;
    tags: string[];
    location: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reviewNotes?: string;
  reviewedBy?: User;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'storyteller' | 'explorer' | 'social' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: 'story_count' | 'likes_received' | 'swaps_completed' | 'cities_visited' | 'special';
    threshold?: number;
    details: string;
  };
  unlockedAt?: string;
  progress?: number;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'writing' | 'exploration' | 'social' | 'community';
  criteria: {
    type: string;
    target: number;
    timeframe: string;
  };
  rewards: {
    badges?: string[];
    xp: number;
    unlocks?: string[];
  };
  participants: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Media {
  _id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
  duration?: number; // For audio/video
  size: number;
  format: string;
  uploadedAt: string;
}

export interface CityTheme {
  name: string;
  gradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern?: string;
  landmarks: string[];
  culturalElements: string[];
  localLanguage?: string;
}

export interface Analytics {
  overview: {
    totalUsers: number;
    totalStories: number;
    totalSwaps: number;
    activeUsers: number;
    totalLocations: number;
  };
  growth: {
    newUsers: {
      count: number;
      growth: string;
    };
    newStories: {
      count: number;
      growth: string;
    };
    engagementRate: {
      value: string;
      growth: string;
    };
  };
  geography: {
    topCities: Array<{
      city: string;
      stories: number;
      users: number;
      growth: string;
    }>;
    heatmapData: Array<{
      coordinates: [number, number];
      intensity: number;
      stories: number;
    }>;
  };
  content: {
    totalStories: number;
    languageBreakdown: Array<{
      language: string;
      count: number;
      percentage: string;
    }>;
    avgLength: number;
    popularTags: Array<{
      name: string;
      count: number;
      growth: string;
    }>;
  };
  swapMechanics: {
    totalSwaps: number;
    successRate: string;
    avgProcessingTime: string;
    popularUnlockReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    avgEngagementPerStory: number;
    topContributors: Array<{
      user: User;
      contribution: string;
      metric: number;
    }>;
  };
  retention: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    returnRate: string;
    avgSessionDuration: string;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  query?: string;
  location?: {
    city?: string;
    radius?: number;
    coordinates?: [number, number];
  };
  tags?: string[];
  language?: 'en' | 'hi';
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'newest' | 'oldest' | 'most_liked' | 'most_viewed' | 'trending';
  isLocked?: boolean;
}

export interface LocationBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

// Zustand Store Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export interface StoriesState {
  stories: Story[];
  currentStory: Story | null;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  fetchStories: (filters?: SearchFilters) => Promise<void>;
  fetchStory: (id: string) => Promise<void>;
  createStory: (storyData: CreateStoryData) => Promise<Story>;
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  likeStory: (id: string) => Promise<void>;
  unlikeStory: (id: string) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearStories: () => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  searchStories: (query: string) => Promise<void>;
}

export interface RegisterData {
  username: string;
  displayName: string;
  email: string;
  password: string;
  city: string;
  state: string;
  bio?: string;
  preferences?: {
    language: 'en' | 'hi';
    notifications: boolean;
  };
}

export interface CreateStoryData {
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  location: string;
  language: 'en' | 'hi';
  media?: File[];
  visibility: 'public' | 'city' | 'friends' | 'private';
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, '_id' | 'createdAt'>) => void;
}

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'swap_approved' | 'swap_rejected' | 'badge_earned' | 'challenge_completed' | 'mention';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Component Props Types
export interface StoryCardProps {
  story: Story;
  variant?: 'default' | 'compact' | 'featured';
  showAuthor?: boolean;
  showLocation?: boolean;
  showStats?: boolean;
  onLike?: (storyId: string) => void;
  onComment?: (storyId: string) => void;
  onShare?: (storyId: string) => void;
  onUnlock?: (storyId: string) => void;
}

export interface MapProps {
  stories: Story[];
  center?: [number, number];
  zoom?: number;
  showClusters?: boolean;
  showHeatmap?: boolean;
  onStorySelect?: (story: Story) => void;
  onLocationChange?: (location: { center: [number, number]; zoom: number }) => void;
  theme?: CityTheme;
}

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error?: string;
}