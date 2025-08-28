'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Lock, Check } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/stores/authStore';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validation/schemas';
import { ApiError } from '@/lib/api/client';

import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert, WarningAlert } from '@/components/ui/Alert';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  className?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token: propToken,
  onSuccess,
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const token = propToken || tokenFromUrl;

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setTokenFromUrl(urlToken);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    clearError();
    clearErrors();

    if (!token) {
      setError('token', {
        type: 'manual',
        message: 'Invalid or missing reset token.',
      });
      return;
    }

    try {
      await resetPassword({
        ...data,
        token,
      });
      
      // Success state
      setResetSuccess(true);
      toast.success('Password reset successfully! You can now sign in with your new password.');
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login?message=password-reset-success');
        }, 2000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific API errors
        if (err.status === 400 || err.status === 404) {
          setError('token', {
            type: 'manual',
            message: 'Invalid or expired reset token. Please request a new password reset.',
          });
        } else if (err.status === 422 && err.errors) {
          // Handle field-specific validation errors from backend
          Object.entries(err.errors).forEach(([field, messages]) => {
            if (field === 'password' || field === 'token') {
              setError(field as keyof ResetPasswordFormData, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else {
          toast.error(err.message || 'Password reset failed. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  // Show success state
  if (resetSuccess) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Password reset successful!
          </h2>
          <p className="mt-2 text-neutral-600">
            Your password has been updated successfully.
          </p>
        </div>

        <SuccessAlert>
          <p className="font-medium mb-2">What's next?</p>
          <p className="text-sm">
            You can now sign in to your Jobifies account using your new password.
            You'll be redirected to the sign-in page shortly.
          </p>
        </SuccessAlert>

        <div className="mt-6">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => router.push('/login')}
          >
            Continue to sign in
          </Button>
        </div>
      </div>
    );
  }

  // Show invalid token state
  if (!token) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Invalid reset link
          </h2>
          <p className="mt-2 text-neutral-600">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <WarningAlert>
          <p className="font-medium mb-2">Reset link issues:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>The link may have expired (valid for 24 hours)</li>
            <li>The link may have already been used</li>
            <li>The link may be incomplete or corrupted</li>
          </ul>
        </WarningAlert>

        <div className="mt-6 space-y-4">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => router.push('/forgot-password')}
          >
            Request new reset link
          </Button>
          
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">
          Reset your password
        </h2>
        <p className="mt-2 text-neutral-600">
          Create a new password for your Jobifies account.
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

      {/* Token Error */}
      {errors.token && (
        <div className="mb-6">
          <ErrorAlert>
            <div className="space-y-2">
              <p className="font-medium">{errors.token.message}</p>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => router.push('/forgot-password')}
                className="p-0 h-auto text-sm underline"
              >
                Request a new password reset
              </Button>
            </div>
          </ErrorAlert>
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6" noValidate>
        {/* Hidden token field */}
        <input type="hidden" {...register('token')} value={token} />

        {/* New Password Field */}
        <FormField
          label="New password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          disabled={isFormLoading}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          onFocus={() => setShowPasswordStrength(true)}
          {...register('password')}
        />

        {/* Password Strength Indicator */}
        {showPasswordStrength && watchedPassword && (
          <PasswordStrengthIndicator 
            password={watchedPassword}
            showRequirements={true}
          />
        )}

        {/* Confirm Password Field */}
        <FormField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          required
          disabled={isFormLoading}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4" />}
          {...register('confirmPassword')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isFormLoading}
          loadingText="Resetting password..."
          disabled={isFormLoading}
        >
          Reset password
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
          >
            Back to sign in
          </Link>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">
          After resetting your password, all active sessions will be terminated for security.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;