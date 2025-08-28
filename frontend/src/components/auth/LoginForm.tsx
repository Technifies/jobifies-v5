'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/stores/authStore';
import { loginSchema, type LoginFormData } from '@/lib/validation/schemas';
import { ApiError } from '@/lib/api/client';

import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showRegisterLink?: boolean;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo,
  showRegisterLink = true,
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    clearError();
    clearErrors();

    try {
      await login({
        ...data,
        rememberMe,
      });

      // Success notification
      toast.success('Welcome back! You have been logged in successfully.');

      // Handle redirect
      const redirect = redirectTo || searchParams.get('redirect') || '/dashboard';
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirect);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific API errors
        if (err.status === 401) {
          setError('password', {
            type: 'manual',
            message: 'Invalid email or password. Please try again.',
          });
        } else if (err.status === 422 && err.errors) {
          // Handle field-specific validation errors from backend
          Object.entries(err.errors).forEach(([field, messages]) => {
            if (field === 'email' || field === 'password') {
              setError(field as keyof LoginFormData, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else {
          toast.error(err.message || 'Login failed. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">
          Welcome back
        </h2>
        <p className="mt-2 text-neutral-600">
          Sign in to your Jobifies account
        </p>
      </div>

      {/* Error Alert */}
      {error && !Object.keys(errors).length && (
        <div className="mb-6">
          <ErrorAlert onClose={clearError}>
            {error}
          </ErrorAlert>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6" noValidate>
        {/* Email Field */}
        <FormField
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={isFormLoading}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          {...register('email')}
        />

        {/* Password Field */}
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={isFormLoading}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          {...register('password')}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isFormLoading}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-neutral-700">
              Remember me
            </span>
          </label>
          
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isFormLoading}
          loadingText="Signing in..."
          disabled={isFormLoading}
        >
          Sign in
        </Button>

        {/* Social Login Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Google Login */}
            <Button
              type="button"
              variant="ghost"
              disabled={isFormLoading}
              onClick={() => {
                toast('Social login coming soon!', { icon: '🚧' });
              }}
              className="border-neutral-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="ml-2">Google</span>
            </Button>

            {/* LinkedIn Login */}
            <Button
              type="button"
              variant="ghost"
              disabled={isFormLoading}
              onClick={() => {
                toast('Social login coming soon!', { icon: '🚧' });
              }}
              className="border-neutral-300"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="ml-2">LinkedIn</span>
            </Button>
          </div>
        </div>

        {/* Register Link */}
        {showRegisterLink && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        )}
      </form>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">
          Protected by industry-standard encryption. Your data is secure.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;