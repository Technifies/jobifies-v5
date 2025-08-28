// Authentication Service for Jobifies Frontend
import { httpClient, TokenStorage } from '../api/client';
import { AuthEndpoints } from '@/types/api';
import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  EmailVerificationData,
  AuthResponse,
  UserRole
} from '@/types/auth';
import { ApiResponse } from '@/types/api';

export class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(AuthEndpoints.LOGIN, {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
      });

      if (response.success && response.data) {
        // Store tokens
        TokenStorage.setTokens(response.data.tokens);
        
        // Store remember me preference
        if (credentials.rememberMe) {
          localStorage.setItem('jobifies_remember_me', 'true');
        } else {
          localStorage.removeItem('jobifies_remember_me');
        }

        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Map frontend field names to backend field names
      const payload = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        role: data.role,
        phone_number: data.phoneNumber?.trim(),
      };

      const response = await httpClient.post<AuthResponse>(AuthEndpoints.REGISTER, payload);

      if (response.success && response.data) {
        // Store tokens
        TokenStorage.setTokens(response.data.tokens);
        
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Attempt to notify backend about logout
      await httpClient.post(AuthEndpoints.LOGOUT);
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Logout request to backend failed:', error);
    } finally {
      // Always clear local tokens and preferences
      TokenStorage.clearTokens();
      localStorage.removeItem('jobifies_remember_me');
      
      // Clear any cached data
      this.clearUserCache();
    }
  }

  // Refresh tokens
  async refreshTokens(): Promise<AuthTokens> {
    try {
      const currentTokens = TokenStorage.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<{ tokens: AuthTokens }>(AuthEndpoints.REFRESH, {
        refreshToken: currentTokens.refreshToken,
      });

      if (response.success && response.data?.tokens) {
        TokenStorage.setTokens(response.data.tokens);
        return response.data.tokens;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      // If refresh fails, clear tokens and force re-login
      TokenStorage.clearTokens();
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<{ user: User }>(AuthEndpoints.ME);

      if (response.success && response.data?.user) {
        // Transform backend field names to frontend field names
        return this.transformUserFromBackend(response.data.user);
      }

      throw new Error('Failed to get user information');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      const response = await httpClient.get(AuthEndpoints.VALIDATE);
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      const response = await httpClient.post(AuthEndpoints.FORGOT_PASSWORD, {
        email: data.email.toLowerCase().trim(),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      const response = await httpClient.post(AuthEndpoints.RESET_PASSWORD, {
        token: data.token,
        password: data.password,
      });

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await httpClient.post(AuthEndpoints.CHANGE_PASSWORD, {
        current_password: data.currentPassword,
        password: data.password,
      });

      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(data: EmailVerificationData): Promise<void> {
    try {
      const response = await httpClient.post(AuthEndpoints.VERIFY_EMAIL, {
        token: data.token,
      });

      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerification(email: string): Promise<void> {
    try {
      const response = await httpClient.post(AuthEndpoints.RESEND_VERIFICATION, {
        email: email.toLowerCase().trim(),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = TokenStorage.getTokens();
    return !!tokens?.accessToken;
  }

  // Check if remember me is enabled
  shouldRememberUser(): boolean {
    return localStorage.getItem('jobifies_remember_me') === 'true';
  }

  // Get stored tokens
  getTokens(): AuthTokens | null {
    return TokenStorage.getTokens();
  }

  // Clear tokens
  clearTokens(): void {
    TokenStorage.clearTokens();
  }

  // Transform user data from backend format to frontend format
  private transformUserFromBackend(backendUser: any): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      role: backendUser.role as UserRole,
      isVerified: backendUser.is_verified,
      isActive: backendUser.is_active,
      profilePicture: backendUser.profile_picture,
      phoneNumber: backendUser.phone_number,
      dateOfBirth: backendUser.date_of_birth ? new Date(backendUser.date_of_birth) : undefined,
      location: backendUser.location,
      createdAt: new Date(backendUser.created_at),
      updatedAt: new Date(backendUser.updated_at),
      lastLogin: backendUser.last_login ? new Date(backendUser.last_login) : undefined,
    };
  }

  // Clear user-related cache
  private clearUserCache(): void {
    // Clear any user-specific cached data
    const keysToRemove = [
      'jobifies_user_preferences',
      'jobifies_dashboard_cache',
      'jobifies_notifications_cache',
    ];

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to clear cache key: ${key}`, error);
      }
    });
  }

  // Handle authentication events
  onTokenExpired(): void {
    this.clearTokens();
    this.clearUserCache();
    
    // Dispatch custom event for app-wide handling
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:session-expired', {
        detail: { timestamp: new Date() }
      }));
    }
  }

  // Auto-refresh token before expiry
  startTokenRefreshTimer(): void {
    const tokens = TokenStorage.getTokens();
    if (!tokens?.accessToken) return;

    try {
      // Decode JWT to get expiry time (simple implementation)
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0);

      if (refreshTime > 0) {
        setTimeout(async () => {
          try {
            await this.refreshTokens();
            this.startTokenRefreshTimer(); // Restart timer with new token
          } catch (error) {
            console.error('Auto token refresh failed:', error);
            this.onTokenExpired();
          }
        }, refreshTime);
      } else {
        // Token is already expired or about to expire
        this.refreshTokens().catch(() => {
          this.onTokenExpired();
        });
      }
    } catch (error) {
      console.error('Failed to parse token for refresh timer:', error);
    }
  }

  // Check session validity
  async checkSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      return await this.validateToken();
    } catch (error) {
      this.onTokenExpired();
      return false;
    }
  }

  // Initialize auth service
  initialize(): void {
    // Start token refresh timer if authenticated
    if (this.isAuthenticated()) {
      this.startTokenRefreshTimer();
    }

    // Listen for auth events
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:token-expired', () => {
        this.onTokenExpired();
      });

      // Handle tab focus to check session validity
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isAuthenticated()) {
          this.checkSession();
        }
      });
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Initialize service
if (typeof window !== 'undefined') {
  authService.initialize();
}

export default authService;