import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, RegisterData } from '@/types';
import { authAPI, apiUtils } from '@/lib/api';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authAPI.login(email, password);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          toast.success(`Welcome back, ${user.displayName}!`);
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Login failed');
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authAPI.register(userData);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          toast.success(`Welcome to Story Swap, ${user.displayName}!`);
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Registration failed');
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        apiUtils.removeAuthToken();
        authAPI.logout().catch(() => {});
        toast.success('Successfully logged out');
      },

      updateProfile: async (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No user logged in');

        try {
          const updatedUser = await authAPI.updateProfile(updates);
          set({ user: updatedUser });
          toast.success('Profile updated successfully');
        } catch (error: any) {
          toast.error(error.message || 'Failed to update profile');
          throw error;
        }
      },

      // Initialize auth state on app load
      initialize: async () => {
        const token = apiUtils.getAuthToken();
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authAPI.getProfile();
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // Invalid token, clear auth state
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          apiUtils.removeAuthToken();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);