import axios, { AxiosInstance } from "axios";
import { Platform } from "react-native";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const API_TIMEOUT = 95000;

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
let refreshSubscribers: ((token: string | null) => void)[] = [];
let accessTokenProvider: ((forceRefresh?: boolean) => Promise<string | null>) | null = null;

export const setAccessTokenProvider = (
  provider: ((forceRefresh?: boolean) => Promise<string | null>) | null
) => {
  accessTokenProvider = provider;
};

const subscribeTokenRefresh = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string | null) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

export default function createAPIClient(): AxiosInstance {
  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    withCredentials: true,
  });

  // Request interceptor - Add token to headers if exists
  apiClient.interceptors.request.use(
    async (config: any) => {
      const accessToken = accessTokenProvider
        ? await accessTokenProvider()
        : null;

      if (accessToken) {
        console.log("Attaching access token to request");
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      config.headers['X-Client-Type'] = Platform.OS === 'web' ? 'WEB' : 'MOBILE';
      
      // Set longer timeout for PSA endpoint since processing can take a while
      if (config.url?.includes('/sendPSA')) {
        config.timeout = 300000; // 5 minutes for PSA endpoint
      }else if (config.url?.includes('/menu')) {
        config.timeout = 300000; // 5 minutes for report generation
      }

      return config;
    }, 
    (error: any) => Promise.reject(error)
  );

  // Response interceptor - Handle 401/403 errors with token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => { 
      const originalRequest = error.config;
      
      // Don't attempt refresh if:
      // 1. Not an auth error (401/403)
      // 2. Already retrying
      // 3. No Auth0 access token provider registered
      // 4. Request is to logout or refresh-token endpoints
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      const isLogoutEndpoint = originalRequest.url?.includes('/logout') || originalRequest.url?.includes('/refresh-token');
      
      if (!isAuthError || originalRequest._retry || !accessTokenProvider || isLogoutEndpoint) {
        return Promise.reject(error);
      }

      // Mark request as retrying to prevent infinite loops
      originalRequest._retry = true;

      // If already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string | null) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await accessTokenProvider(true);

        if (!newAccessToken) {
          throw new Error('No refreshed Auth0 access token available');
        }
        
        // Notify all waiting requests
        onTokenRefreshed(newAccessToken);
        
        // Retry original request with refreshed token
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        onTokenRefreshed(null);
        return Promise.reject(refreshError);
        
      } finally {
        isRefreshing = false;
      }
    }
  );

  return apiClient;
}

// Types for side management
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageURL: string;
  availableSideIds?: string[];
}
