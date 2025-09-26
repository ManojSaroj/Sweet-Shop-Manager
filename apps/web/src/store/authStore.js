import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/apiClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/login', {
            email,
            password,
          });
          
          const { user, accessToken, refreshToken } = response.data;
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed',
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/register', {
            email,
            password,
          });
          
          const { user, accessToken, refreshToken } = response.data;
          
          // Store tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, error: null });
      },

      checkAuth: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          // Verify token by making a request to a protected endpoint
          const response = await apiClient.get('/auth/me');
          set({ user: response.data, isLoading: false });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
