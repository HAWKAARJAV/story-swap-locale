// Smart API URL detection - works for localhost and network access
const getApiBaseUrl = () => {
  // If explicit URL is set, use it
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) return `${envUrl}/api/v1`;
  
  const hostname = window.location.hostname;
  
  // If accessing via network IP (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
  if (hostname.match(/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/)) {
    return `http://${hostname}:3001/api/v1`;
  }
  
  // If accessing via localhost or 127.0.0.1
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/v1';
  }
  
  // Default fallback
  return 'http://localhost:3001/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export interface Story {
  _id: string;
  title: string;
  content: {
    type: string;
    text: {
      body: string;
    };
    snippet: string;
  };
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar?: {
      url: string;
      publicId?: string | null;
    };
    homeCity: string;
    stats: {
      storiesPublished: number;
      storiesUnlocked: number;
      swapsCompleted: number;
      likes: number;
      followers: number;
      following: number;
    };
  };
  location: {
    _id: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
    address: {
      formatted: string;
      city: string;
      state: string;
      country: string;
    };
  };
  tags: string[];
  status: string;
  visibility: string;
  swapSettings: {
    swapRequirements: {
      minContentLength: number;
      requiresLocation: boolean;
      allowedContentTypes: string[];
    };
    isLocked: boolean;
    requiresSwap: boolean;
  };
  moderation: {
    flagCount: number;
    moderationStatus: string;
    flags: string[];
  };
  engagement: {
    views: number;
    likes: number;
    unlocks: number;
    comments: number;
    shares: number;
    saves: number;
  };
  analytics: {
    popularityScore: number;
    trendingScore: number;
    viewHistory: string[];
  };
  metadata: {
    language: string;
    readingTime: number;
    difficulty: string;
    aiGenerated: boolean;
    sources: string[];
    relatedStories: string[];
  };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isUnlocked?: boolean;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: {
    url: string;
    publicId?: string | null;
  };
  homeCity: string;
  bio?: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      weekly: boolean;
    };
    privacy: {
      showEmail: boolean;
      showLocation: boolean;
      allowMessages: boolean;
    };
  };
  stats: {
    storiesPublished: number;
    storiesUnlocked: number;
    swapsCompleted: number;
    likes: number;
    followers: number;
    following: number;
  };
  membership: {
    plan: string;
    joinedAt: string;
    lastActive: string;
  };
  verification: {
    isVerified: boolean;
    verifiedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Filters {
  location: string | null;
  city: string | null;
  tags: string | null;
  search: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Attach auth token if present (dummy auth stores 'authToken')
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const mergedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options?.headers as any,
      };
      if (token && !mergedHeaders['Authorization']) {
        mergedHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers: mergedHeaders,
        cache: 'no-store', // Disable caching to always fetch fresh data
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized (401) – login required or token invalid');
        }
        if (response.status === 403) {
          throw new Error('Forbidden (403) – insufficient permissions');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getStories(params?: {
    page?: number;
    limit?: number;
    location?: string;
    search?: string;
    tags?: string;
  }): Promise<ApiResponse<{ stories: Story[]; pagination: Pagination; filters: Filters }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.location) searchParams.append('location', params.location);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tags) searchParams.append('tags', params.tags);

    const queryString = searchParams.toString();
    const endpoint = `/stories${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ stories: Story[]; pagination: Pagination; filters: Filters }>(endpoint);
  }

  async getMyStories(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ stories: Story[]; pagination: Pagination; filters: Filters }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    // Add author filter for current user
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    
    if (currentUserId) {
      searchParams.append('author', currentUserId);
    } else if (currentUserEmail) {
      // Fallback to email-based filtering if needed
      searchParams.append('authorEmail', currentUserEmail);
    }

    const queryString = searchParams.toString();
    const endpoint = `/stories${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ stories: Story[]; pagination: Pagination; filters: Filters }>(endpoint);
  }

  private getMockStories(): Partial<Story>[] {
    return [
      {
        _id: '1',
        title: 'My Hidden Coffee Spot in Brooklyn',
        content: {
          type: 'story',
          text: { body: 'Found this amazing little café that serves the best cortado I\'ve ever had...' },
          snippet: 'Found this amazing little café that serves the best cortado I\'ve ever had...'
        },
        author: {
          _id: 'user1',
          username: 'sarah_nyc',
          displayName: 'Sarah M.',
          avatar: { url: '/placeholder.svg' },
          homeCity: 'Brooklyn',
          stats: { storiesPublished: 12, storiesUnlocked: 8, swapsCompleted: 5, likes: 156, followers: 89, following: 45 }
        },
        location: {
          _id: 'loc1',
          coordinates: { type: 'Point', coordinates: [-73.9442, 40.6782] },
          address: { formatted: 'Brooklyn, NY', city: 'Brooklyn', state: 'NY', country: 'USA' }
        },
        tags: ['Coffee', 'Hidden Gems', 'NYC'],
        status: 'published',
        visibility: 'public',
        engagement: { likes: 23, comments: 8, views: 156, shares: 5, unlocks: 12, saves: 7 },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        title: 'The Street Art Tour I Created',
        content: {
          type: 'story',
          text: { body: 'After years of exploring murals in my neighborhood, I decided to create my own walking tour...' },
          snippet: 'After years of exploring murals in my neighborhood, I decided to create my own walking tour...'
        },
        author: {
          _id: 'user2',
          username: 'mike_atx',
          displayName: 'Mike D.',
          avatar: { url: '/placeholder.svg' },
          homeCity: 'Austin',
          stats: { storiesPublished: 8, storiesUnlocked: 12, swapsCompleted: 7, likes: 234, followers: 156, following: 67 }
        },
        location: {
          _id: 'loc2',
          coordinates: { type: 'Point', coordinates: [-97.7431, 30.2672] },
          address: { formatted: 'Austin, TX', city: 'Austin', state: 'TX', country: 'USA' }
        },
        tags: ['Art', 'Walking Tours', 'Community'],
        status: 'published',
        visibility: 'public',
        engagement: { likes: 45, comments: 12, views: 234, shares: 8, unlocks: 18, saves: 11 },
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-10T14:20:00Z'
      },
      {
        _id: '3',
        title: 'Grandfather\'s Secret Fishing Spot',
        content: {
          type: 'story',
          text: { body: 'Every summer, my grandfather would take me to this hidden lake in the mountains...' },
          snippet: 'Every summer, my grandfather would take me to this hidden lake in the mountains...'
        },
        author: {
          _id: 'user3',
          username: 'jenny_sf',
          displayName: 'Jenny K.',
          avatar: { url: '/placeholder.svg' },
          homeCity: 'San Francisco',
          stats: { storiesPublished: 15, storiesUnlocked: 6, swapsCompleted: 9, likes: 189, followers: 134, following: 89 }
        },
        location: {
          _id: 'loc3',
          coordinates: { type: 'Point', coordinates: [-122.4194, 37.7749] },
          address: { formatted: 'San Francisco, CA', city: 'San Francisco', state: 'CA', country: 'USA' }
        },
        tags: ['Family', 'Nature', 'Memories'],
        status: 'published',
        visibility: 'public',
        engagement: { likes: 67, comments: 15, views: 189, shares: 12, unlocks: 24, saves: 15 },
        createdAt: '2024-01-08T09:15:00Z',
        updatedAt: '2024-01-08T09:15:00Z'
      }
    ];
  }

  async getStoryById(id: string): Promise<ApiResponse<Story>> {
    return this.request(`/stories/${id}`);
  }

  async createStory(storyData: Partial<Story>): Promise<ApiResponse<Story>> {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { 
    email: string; 
    password: string; 
    username: string; 
    displayName: string; 
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // AI Travel Planning endpoints
  async generateTravelPlan(planData: {
    userInput: string;
    currentMood: string;
    previousStories: string[];
    userId?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/travel/plan', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async analyzeStoryEmotion(storyData: {
    storyContent: string;
    storyTitle: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/travel/analyze-emotion', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  }

  async getUserTravelContext(): Promise<ApiResponse<any>> {
    return this.request('/travel/user-context');
  }

  async saveTripPlan(tripPlan: any): Promise<ApiResponse<any>> {
    return this.request('/travel/save-plan', {
      method: 'POST',
      body: JSON.stringify({ tripPlan }),
    });
  }
}

export const apiService = new ApiService();

// Travel Planner Service
export const travelPlannerService = {
  generatePlan: (planData: any) => apiService.generateTravelPlan(planData),
  analyzeEmotion: (storyData: any) => apiService.analyzeStoryEmotion(storyData),
  getUserContext: () => apiService.getUserTravelContext(),
  savePlan: (tripPlan: any) => apiService.saveTripPlan(tripPlan),
};