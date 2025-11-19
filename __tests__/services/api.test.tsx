import createAPIClient from '@/services/api';
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

jest.mock('axios');
jest.mock('expo-router');
jest.mock('expo-secure-store');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('API Client', () => {
  let apiClient: any;
  let requestInterceptor: any;
  let responseInterceptor: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.create to capture interceptors
    const mockInterceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    };

    mockedAxios.create = jest.fn(() => ({
      interceptors: mockInterceptors,
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })) as any;

    apiClient = createAPIClient();
    
    // Capture the interceptor functions
    requestInterceptor = (apiClient.interceptors.request.use as jest.Mock).mock.calls[0][0];
    responseInterceptor = (apiClient.interceptors.response.use as jest.Mock).mock.calls[0];
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', async () => {
      const mockToken = 'test-access-token';
      mockedSecureStore.getItemAsync.mockResolvedValue(mockToken);

      const config = { headers: {} };
      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should not add authorization header when token does not exist', async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue(null);

      const config = { headers: {} };
      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle web platform cookies', async () => {
      // Mock Platform.OS to be 'web'
      Object.defineProperty(Platform, 'OS', {
        get: jest.fn(() => 'web'),
      });

      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'access_token=web-token-123',
      });

      const config = { headers: {} };
      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer web-token-123');
    });
  });

  describe('Response Interceptor', () => {
    it('should return response when successful', async () => {
      const mockResponse = { data: 'test data' };
      const successHandler = responseInterceptor[0];

      const result = successHandler(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should refresh token on 401 error', async () => {
      const errorHandler = responseInterceptor[1];
      const mockRefreshToken = 'refresh-token-123';
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      mockedSecureStore.getItemAsync.mockResolvedValue(mockRefreshToken);
      
      mockedAxios.post = jest.fn().mockResolvedValue({
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });

      const error = {
        response: { status: 401 },
        config: { headers: {}, _retry: false },
      };

      try {
        await errorHandler(error);
      } catch {
        // Error expected in this test flow
      }

      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('access_token', newAccessToken);
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', newRefreshToken);
    });

    it('should refresh token on 403 error', async () => {
      const errorHandler = responseInterceptor[1];
      const mockRefreshToken = 'refresh-token-123';
      const newAccessToken = 'new-access-token';

      mockedSecureStore.getItemAsync.mockResolvedValue(mockRefreshToken);
      
      mockedAxios.post = jest.fn().mockResolvedValue({
        data: {
          accessToken: newAccessToken,
          refreshToken: 'new-refresh-token',
        },
      });

      const error = {
        response: { status: 403 },
        config: { headers: {}, _retry: false },
      };

      try {
        await errorHandler(error);
      } catch {
        // May throw depending on retry
      }

      expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should logout and redirect on refresh token failure', async () => {
      const errorHandler = responseInterceptor[1];
      
      mockedSecureStore.getItemAsync.mockResolvedValue('refresh-token');
      mockedAxios.post = jest.fn().mockRejectedValue(new Error('Refresh failed'));

      const error = {
        response: { status: 401 },
        config: { headers: {}, _retry: false },
      };

      try {
        await errorHandler(error);
      } catch {
        // Expected to fail
      }

      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('uid');
      expect(router.replace).toHaveBeenCalledWith('/Intro');
    });

    it('should not retry if already retried', async () => {
      const errorHandler = responseInterceptor[1];

      const error = {
        response: { status: 401 },
        config: { headers: {}, _retry: true },
      };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should pass through non-401/403 errors', async () => {
      const errorHandler = responseInterceptor[1];

      const error = {
        response: { status: 500 },
        config: { headers: {} },
      };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle missing refresh token', async () => {
      const errorHandler = responseInterceptor[1];
      
      mockedSecureStore.getItemAsync.mockResolvedValue(null);

      const error = {
        response: { status: 401 },
        config: { headers: {}, _retry: false },
      };

      try {
        await errorHandler(error);
      } catch {
        expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalled();
        expect(router.replace).toHaveBeenCalledWith('/Intro');
      }
    });
  });

  describe('API Client Configuration', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://ide-warehouse-lindsay-naples.trycloudflare.com/api',
        timeout: 10000,
      });
    });

    it('should register request and response interceptors', () => {
      expect(apiClient.interceptors.request.use).toHaveBeenCalled();
      expect(apiClient.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
