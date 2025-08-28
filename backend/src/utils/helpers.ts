import crypto from 'crypto';
import { PaginationQuery, PaginationInfo } from '../types';

// Generate random string
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate UUID v4
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

// Sanitize string for database storage
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

// Calculate pagination info
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationInfo => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
};

// Parse pagination query parameters
export const parsePaginationQuery = (query: any): PaginationQuery => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const sort = query.sort || 'created_at';
  const order = query.order === 'asc' ? 'asc' : 'desc';

  return { page, limit, sort, order };
};

// Calculate offset for database queries
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date, locale: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Slugify string for URLs
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Escape HTML to prevent XSS
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Remove sensitive data from user object
export const sanitizeUser = (user: any): any => {
  const { password_hash, email_verification_token, password_reset_token, ...sanitized } = user;
  return sanitized;
};

// Create error response object
export const createErrorResponse = (message: string, error?: string, statusCode?: number) => {
  return {
    success: false,
    message,
    error: error || 'UNKNOWN_ERROR',
    ...(statusCode && { statusCode }),
  };
};

// Create success response object
export const createSuccessResponse = (message: string, data?: any, pagination?: PaginationInfo) => {
  return {
    success: true,
    message,
    ...(data && { data }),
    ...(pagination && { pagination }),
  };
};

// Sleep function for testing/delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function for external API calls
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) {
        throw lastError;
      }
      await sleep(delay * attempt);
    }
  }
  
  throw lastError!;
};

// Deep merge objects
export const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Check if value is an object
const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Mask sensitive data in logs
export const maskSensitiveData = (obj: any): any => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const masked = { ...obj };
  
  for (const [key, value] of Object.entries(masked)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***masked***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    }
  }
  
  return masked;
};

export default {
  generateRandomString,
  generateUUID,
  sanitizeString,
  calculatePagination,
  parsePaginationQuery,
  calculateOffset,
  isValidEmail,
  isValidUUID,
  formatCurrency,
  formatDate,
  slugify,
  escapeHtml,
  sanitizeUser,
  createErrorResponse,
  createSuccessResponse,
  sleep,
  retry,
  deepMerge,
  maskSensitiveData,
};