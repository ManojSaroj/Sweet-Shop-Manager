import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './authStore';

// Mock axios
const mockAxios = {
  post: vi.fn(),
  get: vi.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
};

vi.mock('axios', () => ({
  default: mockAxios,
}));

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = useAuthStore();
    
    expect(store.user).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const store = useAuthStore();
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com', role: 'USER' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await store.login('test@example.com', 'password123');

      expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(localStorage.getItem('accessToken')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(result).toEqual({ success: true });
    });

    it('should handle login failure', async () => {
      const store = useAuthStore();
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      const result = await store.login('test@example.com', 'wrongpassword');

      expect(store.user).toBeNull();
      expect(result).toEqual({ success: false, error: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const store = useAuthStore();
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com', role: 'USER' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await store.register('test@example.com', 'password123');

      expect(mockAxios.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(store.user).toEqual(mockResponse.data.user);
      expect(result).toEqual({ success: true });
    });

    it('should handle registration failure', async () => {
      const store = useAuthStore();
      const mockError = {
        response: {
          data: { message: 'Email already exists' },
        },
      };

      mockAxios.post.mockRejectedValue(mockError);

      const result = await store.register('test@example.com', 'password123');

      expect(store.user).toBeNull();
      expect(result).toEqual({ success: false, error: 'Email already exists' });
    });
  });

  describe('logout', () => {
    it('should logout and clear user data', () => {
      const store = useAuthStore();
      store.user = { id: '1', email: 'test@example.com', role: 'USER' };
      localStorage.setItem('accessToken', 'access-token');
      localStorage.setItem('refreshToken', 'refresh-token');

      store.logout();

      expect(store.user).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should set user from stored token', async () => {
      const store = useAuthStore();
      const mockUser = { id: '1', email: 'test@example.com', role: 'USER' };
      localStorage.setItem('accessToken', 'access-token');
      
      mockAxios.get.mockResolvedValue({ data: mockUser });

      await store.checkAuth();

      expect(mockAxios.get).toHaveBeenCalledWith('/auth/me');
      expect(store.user).toEqual(mockUser);
    });

    it('should clear user if token is invalid', async () => {
      const store = useAuthStore();
      localStorage.setItem('accessToken', 'invalid-token');
      
      mockAxios.get.mockRejectedValue({ response: { status: 401 } });

      await store.checkAuth();

      expect(store.user).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
});
