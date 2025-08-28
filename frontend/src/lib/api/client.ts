// API Client Configuration for Jobifies Frontend
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, HttpStatus, RequestConfig } from '@/types/api';
import { AuthTokens } from '@/types/auth';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies
});

// Token storage utility
class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'jobifies_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'jobifies_refresh_token';

  static getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
    } catch (error) {
      console.error('Error getting tokens from storage:', error);
    }
    
    return null;
  }

  static setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch (error) {
      console.error('Error setting tokens in storage:', error);
    }
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing tokens from storage:', error);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token from storage:', error);
      return null;
    }
  }
}

// API Error class
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  static fromResponse(response: AxiosResponse): ApiError {
    const { data, status } = response;
    return new ApiError(
      data?.message || 'An error occurred',
      status,
      data?.error || data?.code,
      data?.errors
    );
  }
}

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = TokenStorage.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response time for performance monitoring
    const duration = Date.now() - response.config.metadata?.startTime;
    console.debug(`API Request to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized) - attempt token refresh
    if (error.response?.status === HttpStatus.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = TokenStorage.getTokens();
        if (tokens?.refreshToken) {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refreshToken: tokens.refreshToken },
            { timeout: API_TIMEOUT }
          );
          
          if (refreshResponse.data.success && refreshResponse.data.data?.tokens) {
            const newTokens = refreshResponse.data.data.tokens;
            TokenStorage.setTokens(newTokens);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        TokenStorage.clearTokens();
        
        // Dispatch custom event for auth state reset
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:token-expired'));
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting
    if (error.response?.status === HttpStatus.TOO_MANY_REQUESTS) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter && !originalRequest._retryAfter) {
        originalRequest._retryAfter = true;
        const delay = parseInt(retryAfter) * 1000;
        
        console.warn(`Rate limited. Retrying after ${delay}ms`);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(axiosInstance(originalRequest));
          }, delay);
        });
      }
    }

    // Handle network errors with retry logic
    if (!error.response && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
      
      console.warn(`Network error, retrying in ${delay}ms. Attempt ${originalRequest._retryCount}/${MAX_RETRIES}`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(axiosInstance(originalRequest));
        }, delay);
      });
    }

    // Transform axios error to ApiError
    if (error.response) {
      throw ApiError.fromResponse(error.response);
    } else if (error.request) {
      throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    } else {
      throw new ApiError('An unexpected error occurred.', 0, 'UNKNOWN_ERROR');
    }
  }
);

// HTTP Client class
class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axiosInstance;
  }

  // Generic request method
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Request failed', 500, 'REQUEST_FAILED');
    }
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url,
    });
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    });
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data,
    });
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url,
      data,
    });
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url,
    });
  }

  // Set authorization header
  setAuthToken(token: string): void {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Clear authorization header
  clearAuthToken(): void {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Upload file with progress
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Cancel request
  getCancelToken() {
    return axios.CancelToken.source();
  }

  // Check if error is cancelled
  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient();

// Export token storage utilities
export { TokenStorage };

// Export types
export type { ApiResponse, ApiError as ApiErrorType };

// Default export
export default httpClient;