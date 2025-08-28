'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/stores/authStore';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validation/schemas';
import { ApiError } from '@/lib/api/client';

import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert, InfoAlert } from '@/components/ui/Alert';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  className?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    clearError();
    clearErrors();

    try {
      await forgotPassword(data);
      
      // Success state
      setEmailSent(true);
      setSentToEmail(data.email);
      
      toast.success('Password reset instructions sent to your email.');
      
      if (onSuccess) {
        onSuccess(data.email);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific API errors
        if (err.status === 404) {
          setError('email', {
            type: 'manual',
            message: 'No account found with this email address.',
          });
        } else if (err.status === 429) {
          setError('email', {
            type: 'manual',
            message: 'Too many requests. Please wait before trying again.',
          });
        } else if (err.status === 422 && err.errors) {
          // Handle field-specific validation errors from backend
          Object.entries(err.errors).forEach(([field, messages]) => {
            if (field === 'email') {
              setError('email', {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else {
          toast.error(err.message || 'Failed to send password reset email. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email') || sentToEmail;
    if (email) {
      try {
        await forgotPassword({ email });
        toast.success('Password reset email sent again.');
      } catch (err) {
        toast.error('Failed to resend email. Please try again.');
      }
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  if (emailSent) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Check your email
          </h2>
          <p className="mt-2 text-neutral-600">
            We've sent password reset instructions to
          </p>
          <p className="font-semibold text-neutral-900">{sentToEmail}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <InfoAlert>
            <div className="space-y-2">
              <p className="font-medium">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Check your email inbox</li>
                <li>Look for an email from Jobifies</li>
                <li>Click the reset password link</li>
                <li>Create a new password</li>
              </ol>
            </div>
          </InfoAlert>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleResendEmail}
              loading={isFormLoading}
              loadingText="Resending..."
            >
              Resend email
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-neutral-600">
                Didn't receive the email? Check your spam folder.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Still having trouble?{' '}
            <Link
              href="/contact"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-neutral-600">
          Enter your email address and we'll send you a link to reset your password.
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

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6" noValidate>
        {/* Email Field */}
        <FormField
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
          disabled={isFormLoading}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          helpText="We'll send password reset instructions to this email"
          {...register('email')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isFormLoading}
          loadingText="Sending reset link..."
          disabled={isFormLoading}
        >
          Send reset link
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to sign in
          </Link>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <InfoAlert>
          <p className="text-sm">
            For security reasons, we'll only send the reset link if an account with that email exists.
          </p>
        </InfoAlert>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;