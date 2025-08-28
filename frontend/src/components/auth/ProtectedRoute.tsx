'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, Mail } from 'lucide-react';

import { useAuth } from '@/lib/stores/authStore';
import { UserRole } from '@/types/auth';

import LoadingSpinner, { PageLoading } from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { ErrorAlert, WarningAlert, InfoAlert } from '@/components/ui/Alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  requireVerification?: boolean;
  fallback?: React.ReactNode;
  showErrorPage?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
  requireVerification = false,
  fallback,
  showErrorPage = true,
}) => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading, 
    isInitializing,
    user, 
    error,
    hasAnyRole,
    isVerified,
    resendVerification,
  } = useAuth();

  useEffect(() => {
    // Don't redirect during initialization
    if (isInitializing || isLoading) {
      return;
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // Check role permissions
    if (allowedRoles && allowedRoles.length > 0) {
      if (!hasAnyRole(allowedRoles)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isAuthenticated, 
    isLoading, 
    isInitializing,
    allowedRoles, 
    hasAnyRole, 
    redirectTo, 
    router
  ]);

  // Show loading state during initialization
  if (isInitializing || isLoading) {
    return fallback || <PageLoading text="Loading your account..." />;
  }

  // Show error if there's an authentication error
  if (error && showErrorPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-neutral-600">
              There was a problem with your authentication.
            </p>
          </div>

          <ErrorAlert>
            {error}
          </ErrorAlert>

          <div className="mt-6 space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push('/login')}
            >
              Sign in again
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={() => router.push('/')}
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show loading or let useEffect handle redirect
  if (!isAuthenticated) {
    return fallback || <PageLoading text="Redirecting to sign in..." />;
  }

  // Check email verification requirement
  if (requireVerification && !isVerified()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-warning-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Email Verification Required
            </h2>
            <p className="mt-2 text-neutral-600">
              Please verify your email address to access this page.
            </p>
          </div>

          <WarningAlert>
            <div className="space-y-2">
              <p className="font-medium">
                Your email address ({user?.email}) needs to be verified.
              </p>
              <p className="text-sm">
                Check your email for a verification link, or request a new one below.
              </p>
            </div>
          </WarningAlert>

          <div className="mt-6 space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                if (user?.email) {
                  resendVerification(user.email);
                }
              }}
              loading={isLoading}
              loadingText="Sending..."
            >
              Resend verification email
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={() => router.push('/verify-email')}
            >
              Go to verification page
            </Button>

            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-neutral-600 hover:text-neutral-800 underline"
              >
                Skip verification (limited access)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-error-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h2>
          
          <p className="text-neutral-600 mb-6">
            You don't have permission to access this page.
          </p>

          <InfoAlert className="mb-6">
            <div className="text-left space-y-2">
              <p className="font-medium">Required roles:</p>
              <ul className="list-disc list-inside text-sm">
                {allowedRoles.map((role) => (
                  <li key={role} className="capitalize">
                    {role.replace('_', ' ')}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">
                Current role: <span className="font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
              </p>
            </div>
          </InfoAlert>

          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Higher-order component for easier usage
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
};

// Specific protection components for common scenarios
export const AdminProtectedRoute: React.FC<Omit<ProtectedRouteProps, 'allowedRoles'>> = (props) => (
  <ProtectedRoute {...props} allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} />
);

export const RecruiterProtectedRoute: React.FC<Omit<ProtectedRouteProps, 'allowedRoles'>> = (props) => (
  <ProtectedRoute {...props} allowedRoles={[UserRole.RECRUITER, UserRole.ADMIN, UserRole.SUPER_ADMIN]} />
);

export const JobSeekerProtectedRoute: React.FC<Omit<ProtectedRouteProps, 'allowedRoles'>> = (props) => (
  <ProtectedRoute {...props} allowedRoles={[UserRole.JOB_SEEKER]} />
);

export const VerifiedProtectedRoute: React.FC<Omit<ProtectedRouteProps, 'requireVerification'>> = (props) => (
  <ProtectedRoute {...props} requireVerification={true} />
);

export default ProtectedRoute;