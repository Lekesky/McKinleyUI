import axios, { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie helper for web
const getCookie = (name: string): string | null => {
  if (Platform.OS !== 'web') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  if (Platform.OS !== 'web') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // SameSite=None is required for cross-origin requests, Secure flag is required when using SameSite=None
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=None;Secure`;
};

const deleteCookie = (name: string) => {
  if (Platform.OS !== 'web') return;
  // Must match the SameSite and Secure attributes used when setting the cookie
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=None;Secure`;
};

// Storage abstraction
const getStoredItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return getCookie(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const setStoredItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    setCookie(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteStoredItem = async (key: string) => {
  if (Platform.OS === 'web') {
    deleteCookie(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Export storage utilities for use in other modules
export { deleteStoredItem, getStoredItem, setStoredItem };

// Pagination interfaces
export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
}

// Token refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let isLoggingOut = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to set logout state from AuthContext
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

const clearTokensAndLogout = async () => {
  await Promise.all([
    deleteStoredItem(ACCESS_TOKEN_KEY),
    deleteStoredItem(REFRESH_TOKEN_KEY),
    deleteStoredItem('uid')
  ]);
};

export default function createAPIClient(): AxiosInstance {
  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
  });

  // Request interceptor - Add token to headers if exists
  apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = await getStoredItem(ACCESS_TOKEN_KEY);
    
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log(accessToken);
      }
      config.headers['X-Client-Type'] = Platform.OS === 'web' ? 'WEB' : 'MOBILE';
      
      return config;
    }, 
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle 401/403 errors with token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => { 
      const originalRequest = error.config;
      
      // Don't attempt refresh if:
      // 1. Not an auth error (401/403)
      // 2. Already retrying
      // 3. Currently logging out
      // 4. Request is to logout or refresh-token endpoints
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      const isLogoutEndpoint = originalRequest.url?.includes('/logout') || originalRequest.url?.includes('/refresh-token');
      
      if (!isAuthError || originalRequest._retry || isLoggingOut || isLogoutEndpoint) {
        return Promise.reject(error);
      }

      // Mark request as retrying to prevent infinite loops
      originalRequest._retry = true;

      // If already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // For web, cookies are sent automatically with withCredentials
        // For mobile, we need to send the refresh token in the body
        const refreshToken = Platform.OS === 'web' ? null : await getStoredItem(REFRESH_TOKEN_KEY);
        
        if (Platform.OS !== 'web' && !refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Use a fresh axios instance for refresh to avoid interceptor loops
        const response = await axios.post(
          `${API_URL}/user/refresh-token`,
          Platform.OS === 'web' ? {} : { refreshToken },
          { 
            headers: { 'X-Client-Type': Platform.OS === 'web' ? 'WEB' : 'MOBILE' },
            withCredentials: true, // Important for web to send cookies
            timeout: 10000 
          }
        );
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // For mobile, save new tokens. For web, tokens are in HTTP-only cookies
        if (Platform.OS !== 'web' && newAccessToken && newRefreshToken) {
          await Promise.all([
            setStoredItem(ACCESS_TOKEN_KEY, newAccessToken),
            setStoredItem(REFRESH_TOKEN_KEY, newRefreshToken)
          ]);
        }
        
        // Notify all waiting requests
        onTokenRefreshed(newAccessToken || 'cookie-auth');
        
        // Retry original request with new token (for mobile) or cookies (for web)
        if (Platform.OS !== 'web' && newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Clear tokens and logout on refresh failure
        await clearTokensAndLogout();
        return Promise.reject(refreshError);
        
      } finally {
        isRefreshing = false;
      }
    }
  );

  return apiClient;
}