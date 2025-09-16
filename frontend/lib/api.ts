import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  User, 
  Story, 
  Swap, 
  Analytics, 
  APIResponse, 
  SearchFilters, 
  RegisterData, 
  CreateStoryData 
} from '@/types';
import { storage } from './utils';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'story_swap_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      storage.remove(TOKEN_KEY);
      // Redirect to login if needed
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Generic API request function
async function request<T = any>(
  config: AxiosRequestConfig
): Promise<APIResponse<T>> {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
}

// Authentication API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await request<{ user: User; token: string }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
    
    if (response.data?.token) {
      storage.set(TOKEN_KEY, response.data.token);
    }
    
    return response.data!;
  },

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await request<{ user: User; token: string }>({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
    
    if (response.data?.token) {
      storage.set(TOKEN_KEY, response.data.token);
    }
    
    return response.data!;
  },

  async logout(): Promise<void> {
    storage.remove(TOKEN_KEY);
    await request({
      method: 'POST',
      url: '/auth/logout',
    });
  },

  async getProfile(): Promise<User> {
    const response = await request<User>({
      method: 'GET',
      url: '/auth/profile',
    });
    return response.data!;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await request<User>({
      method: 'PATCH',
      url: '/auth/profile',
      data: updates,
    });
    return response.data!;
  },

  async forgotPassword(email: string): Promise<void> {
    await request({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await request({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, password },
    });
  },
};

// Stories API
export const storiesAPI = {
  async getStories(filters?: SearchFilters): Promise<{
    stories: Story[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filters?.query) params.append('search', filters.query);
    if (filters?.location?.city) params.append('city', filters.location.city);
    if (filters?.location?.radius) params.append('radius', filters.location.radius.toString());
    if (filters?.location?.coordinates) {
      params.append('lat', filters.location.coordinates[1].toString());
      params.append('lng', filters.location.coordinates[0].toString());
    }
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.language) params.append('language', filters.language);
    if (filters?.author) params.append('author', filters.author);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (typeof filters?.isLocked === 'boolean') {
      params.append('locked', filters.isLocked.toString());
    }

    const response = await request<{
      stories: Story[];
      pagination: any;
    }>({
      method: 'GET',
      url: `/stories?${params.toString()}`,
    });
    
    return response.data!;
  },

  async getStory(id: string): Promise<Story> {
    const response = await request<Story>({
      method: 'GET',
      url: `/stories/${id}`,
    });
    return response.data!;
  },

  async createStory(storyData: CreateStoryData): Promise<Story> {
    const formData = new FormData();
    
    formData.append('title', storyData.title);
    formData.append('content', storyData.content);
    if (storyData.summary) formData.append('summary', storyData.summary);
    formData.append('location', storyData.location);
    formData.append('language', storyData.language);
    formData.append('visibility', storyData.visibility);
    
    storyData.tags.forEach(tag => formData.append('tags', tag));
    
    if (storyData.media?.length) {
      storyData.media.forEach(file => formData.append('media', file));
    }

    const response = await request<Story>({
      method: 'POST',
      url: '/stories',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data!;
  },

  async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    const response = await request<Story>({
      method: 'PATCH',
      url: `/stories/${id}`,
      data: updates,
    });
    return response.data!;
  },

  async deleteStory(id: string): Promise<void> {
    await request({
      method: 'DELETE',
      url: `/stories/${id}`,
    });
  },

  async likeStory(id: string): Promise<{ likes: number }> {
    const response = await request<{ likes: number }>({
      method: 'POST',
      url: `/stories/${id}/like`,
    });
    return response.data!;
  },

  async unlikeStory(id: string): Promise<{ likes: number }> {
    const response = await request<{ likes: number }>({
      method: 'DELETE',
      url: `/stories/${id}/like`,
    });
    return response.data!;
  },

  async getTrendingStories(): Promise<Story[]> {
    const response = await request<Story[]>({
      method: 'GET',
      url: '/stories/trending',
    });
    return response.data!;
  },

  async getMyStories(): Promise<Story[]> {
    const response = await request<Story[]>({
      method: 'GET',
      url: '/stories/my-stories',
    });
    return response.data!;
  },

  async reportStory(id: string, reason: string): Promise<void> {
    await request({
      method: 'POST',
      url: `/stories/${id}/report`,
      data: { reason },
    });
  },
};

// Swaps API
export const swapsAPI = {
  async requestSwap(targetStoryId: string, offeredStory: {
    title: string;
    content: string;
    summary?: string;
    tags: string[];
    location: string;
  }): Promise<Swap> {
    const response = await request<Swap>({
      method: 'POST',
      url: '/swaps/request',
      data: {
        targetStoryId,
        offeredStory,
      },
    });
    return response.data!;
  },

  async getMySwaps(): Promise<Swap[]> {
    const response = await request<Swap[]>({
      method: 'GET',
      url: '/swaps/my-swaps',
    });
    return response.data!;
  },

  async getSwapDetails(id: string): Promise<Swap> {
    const response = await request<Swap>({
      method: 'GET',
      url: `/swaps/${id}`,
    });
    return response.data!;
  },

  async cancelSwap(id: string): Promise<void> {
    await request({
      method: 'DELETE',
      url: `/swaps/${id}`,
    });
  },

  async checkSwapStatus(targetStoryId: string): Promise<{ canUnlock: boolean; swapRequired: boolean }> {
    const response = await request<{ canUnlock: boolean; swapRequired: boolean }>({
      method: 'GET',
      url: `/swaps/check/${targetStoryId}`,
    });
    return response.data!;
  },
};

// Locations API
export const locationsAPI = {
  async getLocations(city?: string): Promise<any[]> {
    const params = city ? `?city=${encodeURIComponent(city)}` : '';
    const response = await request<any[]>({
      method: 'GET',
      url: `/locations${params}`,
    });
    return response.data!;
  },

  async searchLocations(query: string): Promise<any[]> {
    const response = await request<any[]>({
      method: 'GET',
      url: `/locations/search?q=${encodeURIComponent(query)}`,
    });
    return response.data!;
  },
};

// Tags API
export const tagsAPI = {
  async getTags(): Promise<any[]> {
    const response = await request<any[]>({
      method: 'GET',
      url: '/tags',
    });
    return response.data!;
  },

  async getPopularTags(): Promise<any[]> {
    const response = await request<any[]>({
      method: 'GET',
      url: '/tags/popular',
    });
    return response.data!;
  },
};

// Users API
export const usersAPI = {
  async getUser(id: string): Promise<User> {
    const response = await request<User>({
      method: 'GET',
      url: `/users/${id}`,
    });
    return response.data!;
  },

  async followUser(id: string): Promise<void> {
    await request({
      method: 'POST',
      url: `/users/${id}/follow`,
    });
  },

  async unfollowUser(id: string): Promise<void> {
    await request({
      method: 'DELETE',
      url: `/users/${id}/follow`,
    });
  },

  async getUserStats(id: string): Promise<{
    storiesCount: number;
    followersCount: number;
    followingCount: number;
    totalLikes: number;
  }> {
    const response = await request<{
      storiesCount: number;
      followersCount: number;
      followingCount: number;
      totalLikes: number;
    }>({
      method: 'GET',
      url: `/users/${id}/stats`,
    });
    return response.data!;
  },
};

// Admin API (for admin dashboard)
export const adminAPI = {
  async getAnalytics(timeframe: string = '30d'): Promise<Analytics> {
    const response = await request<Analytics>({
      method: 'GET',
      url: `/admin/analytics?timeframe=${timeframe}`,
    });
    return response.data!;
  },

  async getUsers(page: number = 1, limit: number = 50, filters?: any): Promise<{
    users: User[];
    pagination: any;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await request<{
      users: User[];
      pagination: any;
    }>({
      method: 'GET',
      url: `/admin/users?${params.toString()}`,
    });
    return response.data!;
  },

  async updateUser(id: string, updates: any): Promise<User> {
    const response = await request<User>({
      method: 'PATCH',
      url: `/admin/users/${id}`,
      data: updates,
    });
    return response.data!;
  },

  async getModerationQueue(): Promise<any[]> {
    const response = await request<any[]>({
      method: 'GET',
      url: '/admin/moderation',
    });
    return response.data!;
  },
};

// Comments API
export const commentsAPI = {
  async getComments(storyId: string): Promise<any[]> {
    const response = await request<any[]>({
      method: 'GET',
      url: `/stories/${storyId}/comments`,
    });
    return response.data!;
  },

  async addComment(storyId: string, content: string, parentId?: string): Promise<any> {
    const response = await request<any>({
      method: 'POST',
      url: `/stories/${storyId}/comments`,
      data: { content, parentId },
    });
    return response.data!;
  },

  async updateComment(id: string, content: string): Promise<any> {
    const response = await request<any>({
      method: 'PATCH',
      url: `/comments/${id}`,
      data: { content },
    });
    return response.data!;
  },

  async deleteComment(id: string): Promise<void> {
    await request({
      method: 'DELETE',
      url: `/comments/${id}`,
    });
  },

  async likeComment(id: string): Promise<{ likes: number }> {
    const response = await request<{ likes: number }>({
      method: 'POST',
      url: `/comments/${id}/like`,
    });
    return response.data!;
  },
};

// Upload API
export const uploadAPI = {
  async uploadImage(file: File): Promise<{ url: string; thumbnail?: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await request<{ url: string; thumbnail?: string }>({
      method: 'POST',
      url: '/upload/image',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data!;
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await request<{ url: string }>({
      method: 'POST',
      url: '/upload/avatar',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data!;
  },
};

// Utility functions
export const apiUtils = {
  setAuthToken(token: string): void {
    storage.set(TOKEN_KEY, token);
  },

  removeAuthToken(): void {
    storage.remove(TOKEN_KEY);
  },

  getAuthToken(): string | null {
    return storage.get(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!storage.get(TOKEN_KEY);
  },
};

export default api;