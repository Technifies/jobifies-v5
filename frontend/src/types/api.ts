// API Types and Interfaces for Jobifies Frontend

// Generic API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// HTTP Methods
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// Request Configuration
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  requiresAuth?: boolean;
  retryOnTokenExpiry?: boolean;
  suppressErrorToast?: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

// Authentication API Endpoints
export enum AuthEndpoints {
  LOGIN = '/api/v1/auth/login',
  REGISTER = '/api/v1/auth/register',
  LOGOUT = '/api/v1/auth/logout',
  REFRESH = '/api/v1/auth/refresh',
  FORGOT_PASSWORD = '/api/v1/auth/forgot-password',
  RESET_PASSWORD = '/api/v1/auth/reset-password',
  CHANGE_PASSWORD = '/api/v1/auth/change-password',
  VERIFY_EMAIL = '/api/v1/auth/verify-email',
  RESEND_VERIFICATION = '/api/v1/auth/resend-verification',
  ME = '/api/v1/auth/me',
  VALIDATE = '/api/v1/auth/validate'
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Form Submission States
export interface SubmissionState extends LoadingState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

// API Client Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

// Interceptor Types
export interface RequestInterceptor {
  onFulfilled?: (config: any) => any;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: any) => any;
  onRejected?: (error: any) => any;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

// Network Status Types
export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

// Cache Types
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

// Request Queue Types (for offline support)
export interface QueuedRequest {
  id: string;
  config: RequestConfig;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

// File Upload Types
export interface FileUploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  multiple: boolean;
  directory?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  timeRemaining?: number;
  speed?: number;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
}

// Webhook Types (for real-time updates)
export interface WebhookPayload<T = any> {
  event: string;
  data: T;
  timestamp: string;
  source: string;
}

// Metrics Types
export interface RequestMetrics {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: Date;
  size: number;
}

export interface ApiMetrics {
  totalRequests: number;
  successRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  slowestRequest: RequestMetrics;
  fastestRequest: RequestMetrics;
  errorRate: number;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    email: 'up' | 'down';
  };
  responseTime: number;
}

// Feature Flag Types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetUsers?: string[];
  targetRoles?: string[];
}

export default {};