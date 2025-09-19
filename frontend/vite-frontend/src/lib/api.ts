const API_BASE_URL = 'http://localhost:3001/api/v1';

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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
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
    
    return this.request(endpoint);
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
}

export const apiService = new ApiService();