import { create } from 'zustand';
import { StoriesState, Story, SearchFilters, CreateStoryData } from '@/types';
import { storiesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  currentStory: null,
  loading: false,
  error: null,
  filters: {
    sortBy: 'newest',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },

  fetchStories: async (filters?: SearchFilters) => {
    const currentState = get();
    const newFilters = { ...currentState.filters, ...filters };
    const isNewSearch = JSON.stringify(newFilters) !== JSON.stringify(currentState.filters);
    
    if (isNewSearch) {
      set({ 
        loading: true, 
        error: null, 
        filters: newFilters,
        pagination: { ...currentState.pagination, page: 1 }
      });
    } else {
      set({ loading: true, error: null });
    }

    try {
      const { stories, pagination } = await storiesAPI.getStories({
        ...newFilters,
        ...{ page: isNewSearch ? 1 : currentState.pagination.page }
      });

      set(state => ({
        stories: isNewSearch ? stories : [...state.stories, ...stories],
        pagination: {
          ...pagination,
          hasMore: pagination.page < pagination.pages
        },
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch stories'
      });
      toast.error(error.message || 'Failed to load stories');
    }
  },

  fetchStory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const story = await storiesAPI.getStory(id);
      set({ 
        currentStory: story, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch story'
      });
      toast.error(error.message || 'Failed to load story');
    }
  },

  createStory: async (storyData: CreateStoryData) => {
    try {
      const newStory = await storiesAPI.createStory(storyData);
      
      set(state => ({
        stories: [newStory, ...state.stories],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      }));
      
      toast.success('Story created successfully!');
      return newStory;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create story');
      throw error;
    }
  },

  updateStory: async (id: string, updates: Partial<Story>) => {
    try {
      const updatedStory = await storiesAPI.updateStory(id, updates);
      
      set(state => ({
        stories: state.stories.map(story => 
          story._id === id ? updatedStory : story
        ),
        currentStory: state.currentStory?._id === id ? updatedStory : state.currentStory
      }));
      
      toast.success('Story updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update story');
      throw error;
    }
  },

  deleteStory: async (id: string) => {
    try {
      await storiesAPI.deleteStory(id);
      
      set(state => ({
        stories: state.stories.filter(story => story._id !== id),
        currentStory: state.currentStory?._id === id ? null : state.currentStory,
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1)
        }
      }));
      
      toast.success('Story deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete story');
      throw error;
    }
  },

  likeStory: async (id: string) => {
    const optimisticUpdate = (story: Story) => ({
      ...story,
      likes: story.likes + 1,
      likedBy: [...story.likedBy, 'current-user'] // Will be replaced with actual user ID
    });

    // Optimistic update
    set(state => ({
      stories: state.stories.map(story => 
        story._id === id ? optimisticUpdate(story) : story
      ),
      currentStory: state.currentStory?._id === id 
        ? optimisticUpdate(state.currentStory) 
        : state.currentStory
    }));

    try {
      await storiesAPI.likeStory(id);
    } catch (error: any) {
      // Revert optimistic update on error
      set(state => ({
        stories: state.stories.map(story => 
          story._id === id ? {
            ...story,
            likes: story.likes - 1,
            likedBy: story.likedBy.filter(userId => userId !== 'current-user')
          } : story
        ),
        currentStory: state.currentStory?._id === id ? {
          ...state.currentStory,
          likes: state.currentStory.likes - 1,
          likedBy: state.currentStory.likedBy.filter(userId => userId !== 'current-user')
        } : state.currentStory
      }));
      
      toast.error(error.message || 'Failed to like story');
      throw error;
    }
  },

  unlikeStory: async (id: string) => {
    const optimisticUpdate = (story: Story) => ({
      ...story,
      likes: Math.max(0, story.likes - 1),
      likedBy: story.likedBy.filter(userId => userId !== 'current-user')
    });

    // Optimistic update
    set(state => ({
      stories: state.stories.map(story => 
        story._id === id ? optimisticUpdate(story) : story
      ),
      currentStory: state.currentStory?._id === id 
        ? optimisticUpdate(state.currentStory) 
        : state.currentStory
    }));

    try {
      await storiesAPI.unlikeStory(id);
    } catch (error: any) {
      // Revert optimistic update on error
      set(state => ({
        stories: state.stories.map(story => 
          story._id === id ? {
            ...story,
            likes: story.likes + 1,
            likedBy: [...story.likedBy, 'current-user']
          } : story
        ),
        currentStory: state.currentStory?._id === id ? {
          ...state.currentStory,
          likes: state.currentStory.likes + 1,
          likedBy: [...state.currentStory.likedBy, 'current-user']
        } : state.currentStory
      }));
      
      toast.error(error.message || 'Failed to unlike story');
      throw error;
    }
  },

  setFilters: (filters: SearchFilters) => {
    set({ filters });
  },

  clearStories: () => {
    set({
      stories: [],
      currentStory: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true,
      },
      error: null
    });
  },

  // Load more stories (infinite scroll)
  loadMore: async () => {
    const { pagination, loading } = get();
    if (loading || !pagination.hasMore) return;

    set(state => ({
      pagination: {
        ...state.pagination,
        page: state.pagination.page + 1
      }
    }));

    await get().fetchStories();
  },

  // Refresh stories
  refresh: async () => {
    const { filters } = get();
    set({
      stories: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true,
      }
    });
    await get().fetchStories(filters);
  },

  // Toggle story bookmark
  toggleBookmark: async (id: string) => {
    // This would integrate with a bookmarks API endpoint
    // For now, we'll implement local state management
    set(state => ({
      stories: state.stories.map(story => 
        story._id === id ? {
          ...story,
          // Add bookmarked field to story type if needed
        } : story
      )
    }));
  },

  // Search stories
  searchStories: async (query: string) => {
    const searchFilters: SearchFilters = {
      query,
      sortBy: 'newest'
    };
    await get().fetchStories(searchFilters);
  },
}));