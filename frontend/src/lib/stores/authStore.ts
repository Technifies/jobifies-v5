// Authentication Store using Zustand for Jobifies Frontend
import React from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authService } from '../services/authService';
import { ApiError } from '../api/client';
import {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  EmailVerificationData,
  UserRole
} from '@/types/auth';

interface AuthStore {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  lastActivity: Date | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  verifyEmail: (data: EmailVerificationData) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isVerified: () => boolean;
  updateLastActivity: () => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,
      error: null,
      lastActivity: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const authResponse = await authService.login(credentials);
          
          set({
            user: authResponse.user,
            tokens: authResponse.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: new Date(),
          });

          // Track login event
          get().updateLastActivity();
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Login failed. Please try again.';
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const authResponse = await authService.register(data);
          
          set({
            user: authResponse.user,
            tokens: authResponse.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: new Date(),
          });

          get().updateLastActivity();
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Registration failed. Please try again.';
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          await authService.logout();
        } catch (error) {
          console.warn('Logout error:', error);
        } finally {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastActivity: null,
          });
        }
      },

      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.forgotPassword(data);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Failed to send password reset email. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      resetPassword: async (data: ResetPasswordData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.resetPassword(data);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Password reset failed. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.changePassword(data);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Password change failed. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      verifyEmail: async (data: EmailVerificationData) => {
        set({ isLoading: true, error: null });

        try {
          await authService.verifyEmail(data);
          
          // Update user verification status if user is logged in
          const { user } = get();
          if (user) {
            set({
              user: { ...user, isVerified: true },
              isLoading: false,
              error: null,
            });
          } else {
            set({ isLoading: false, error: null });
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Email verification failed. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await authService.resendVerification(email);
          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Failed to resend verification email. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          throw error;
        }
      },

      refreshTokens: async () => {
        try {
          const tokens = await authService.refreshTokens();
          set({ tokens });
        } catch (error) {
          console.error('Token refresh failed:', error);
          
          // Force logout on refresh failure
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: 'Session expired. Please login again.',
          });

          throw error;
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const tokens = authService.getTokens();
        
        if (!tokens) {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isInitializing: false,
          });
          return;
        }

        set({ isLoading: true });

        try {
          const isValid = await authService.validateToken();
          
          if (isValid) {
            // Get current user information
            const user = await authService.getCurrentUser();
            
            set({
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              isInitializing: false,
              lastActivity: new Date(),
            });
          } else {
            // Invalid token, clear auth state
            authService.clearTokens();
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              isLoading: false,
              isInitializing: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          
          // Clear tokens on error
          authService.clearTokens();
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            isInitializing: false,
            error: error instanceof ApiError ? error.message : null,
          });
        }
      },

      initialize: async () => {
        set({ isInitializing: true });
        await get().checkAuth();
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      isVerified: () => {
        const { user } = get();
        return user?.isVerified ?? false;
      },

      updateLastActivity: () => {
        set({ lastActivity: new Date() });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // Only persist essential data, not sensitive information
        lastActivity: state.lastActivity,
      }),
    }
  )
);

// Hook for using auth store
export const useAuth = () => {
  const store = useAuthStore();
  
  // Auto-update last activity on store access
  React.useEffect(() => {
    if (store.isAuthenticated) {
      store.updateLastActivity();
    }
  }, [store.isAuthenticated]);

  return store;
};

// Hook for checking specific roles
export const useRole = (role: UserRole) => {
  return useAuthStore((state) => state.hasRole(role));
};

// Hook for checking multiple roles
export const useRoles = (roles: UserRole[]) => {
  return useAuthStore((state) => state.hasAnyRole(roles));
};

// Hook for authentication status only
export const useAuthStatus = () => {
  return useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitializing: state.isInitializing,
    user: state.user,
  }));
};

// Selector hooks for specific pieces of state
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

// Initialize auth store on app load
if (typeof window !== 'undefined') {
  // Listen for auth events from the service
  window.addEventListener('auth:session-expired', () => {
    useAuthStore.getState().logout();
  });

  window.addEventListener('auth:token-expired', () => {
    useAuthStore.getState().setError('Your session has expired. Please login again.');
    useAuthStore.getState().logout();
  });

  // Initialize on load
  useAuthStore.getState().initialize();
}

export default useAuthStore;