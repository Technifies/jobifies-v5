'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Mail, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/stores/authStore';
import { ApiError } from '@/lib/api/client';

import Button from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert, InfoAlert, WarningAlert } from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface EmailVerificationFormProps {
  token?: string;
  email?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  token: propToken,
  email: propEmail,
  onSuccess,
  onError,
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification, isLoading, user, clearError } = useAuth();
  
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);
  const [emailFromUrl, setEmailFromUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error' | 'expired'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const token = propToken || tokenFromUrl;
  const email = propEmail || emailFromUrl || user?.email;

  useEffect(() => {
    // Get token and email from URL parameters
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken) {
      setTokenFromUrl(urlToken);
    }
    if (urlEmail) {
      setEmailFromUrl(decodeURIComponent(urlEmail));
    }
  }, [searchParams]);

  useEffect(() => {
    // Auto-verify if token is present
    if (token && verificationStatus === 'pending') {
      handleVerifyEmail();
    }
  }, [token]);

  const handleVerifyEmail = async () => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Invalid or missing verification token.');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('verifying');
    clearError();

    try {
      await verifyEmail({ token });
      
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard?message=email-verified');
        }, 2000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        let status: 'error' | 'expired' = 'error';
        let message = 'Email verification failed. Please try again.';

        if (err.status === 400 || err.status === 404) {
          if (err.message.includes('expired') || err.message.includes('invalid')) {
            status = 'expired';
            message = 'This verification link has expired or is invalid.';
          } else {
            message = err.message;
          }
        } else if (err.status === 409) {
          // Already verified
          status = 'success';
          message = 'Your email is already verified!';
          setVerificationStatus('success');
          toast.success(message);
          return;
        } else {
          message = err.message;
        }

        setVerificationStatus(status);
        setErrorMessage(message);

        if (onError) {
          onError(message);
        }
      } else {
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
        
        if (onError) {
          onError('An unexpected error occurred. Please try again.');
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email address is required to resend verification.');
      return;
    }

    try {
      await resendVerification(email);
      toast.success('Verification email sent! Please check your inbox.');
      setVerificationStatus('pending');
      setErrorMessage('');
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || 'Failed to resend verification email.');
      } else {
        toast.error('Failed to resend verification email. Please try again.');
      }
    }
  };

  const isFormLoading = isLoading || isVerifying;

  // Verifying state
  if (verificationStatus === 'verifying') {
    return (
      <div className={`w-full max-w-md mx-auto text-center ${className}`}>
        <div className="space-y-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <LoadingSpinner size="md" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Verifying your email
            </h2>
            <p className="text-neutral-600">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verificationStatus === 'success') {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Email verified!
          </h2>
          <p className="mt-2 text-neutral-600">
            Your email address has been successfully verified.
          </p>
        </div>

        <SuccessAlert>
          <div className="space-y-2">
            <p className="font-medium">Welcome to Jobifies! 🎉</p>
            <p className="text-sm">
              Your account is now fully activated. You can access all features including:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Browse and apply to jobs</li>
              <li>Receive job recommendations</li>
              <li>Connect with employers</li>
              <li>Access premium features</li>
            </ul>
          </div>
        </SuccessAlert>

        <div className="mt-6">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Expired token state
  if (verificationStatus === 'expired') {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-warning-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Link expired
          </h2>
          <p className="mt-2 text-neutral-600">
            This email verification link has expired or is invalid.
          </p>
        </div>

        <WarningAlert>
          <div className="space-y-2">
            <p className="font-medium">Verification links expire after 24 hours</p>
            <p className="text-sm">
              For security reasons, email verification links are only valid for 24 hours.
              You'll need to request a new verification email.
            </p>
          </div>
        </WarningAlert>

        <div className="mt-6 space-y-4">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleResendVerification}
            loading={isFormLoading}
            loadingText="Sending..."
            disabled={!email}
          >
            Send new verification email
          </Button>
          
          {!email && (
            <InfoAlert>
              <p className="text-sm">
                Please{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-500 underline"
                >
                  sign in
                </Link>
                {' '}to resend the verification email.
              </p>
            </InfoAlert>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (verificationStatus === 'error') {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Verification failed
          </h2>
          <p className="mt-2 text-neutral-600">
            We couldn't verify your email address.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6">
            <ErrorAlert>
              {errorMessage}
            </ErrorAlert>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {token && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleVerifyEmail}
              loading={isFormLoading}
              loadingText="Retrying..."
            >
              Try again
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleResendVerification}
            loading={isFormLoading}
            loadingText="Sending..."
            disabled={!email}
          >
            Send new verification email
          </Button>
          
          <div className="text-center">
            <Link
              href="/contact"
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
            >
              Contact support if you continue having issues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending state (no token in URL, manual verification needed)
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900">
          Check your email
        </h2>
        <p className="mt-2 text-neutral-600">
          We've sent a verification link to your email address.
        </p>
        {email && (
          <p className="font-semibold text-neutral-900 mt-1">{email}</p>
        )}
      </div>

      <InfoAlert>
        <div className="space-y-2">
          <p className="font-medium">To complete your registration:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Check your email inbox</li>
            <li>Look for an email from Jobifies</li>
            <li>Click the verification link</li>
          </ol>
          <p className="text-sm mt-2">
            The verification link will expire in 24 hours.
          </p>
        </div>
      </InfoAlert>

      <div className="mt-6 space-y-4">
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handleResendVerification}
          loading={isFormLoading}
          loadingText="Sending..."
          disabled={!email}
        >
          Resend verification email
        </Button>

        {!email && (
          <InfoAlert>
            <p className="text-sm">
              Please{' '}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-500 underline"
              >
                sign in
              </Link>
              {' '}to resend the verification email.
            </p>
          </InfoAlert>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600">
            Didn't receive the email? Check your spam folder.
          </p>
          <Link
            href="/dashboard"
            className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
          >
            Continue to dashboard (verify later)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;