'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { User, Briefcase, Mail, Lock, Phone, Check } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/stores/authStore';
import { registerSchema, type RegisterFormData } from '@/lib/validation/schemas';
import { ApiError } from '@/lib/api/client';
import { UserRole } from '@/types/auth';

import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { ErrorAlert, InfoAlert } from '@/components/ui/Alert';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showLoginLink?: boolean;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo,
  showLoginLink = true,
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: undefined,
      phoneNumber: '',
      acceptTerms: false,
    },
  });

  const watchedPassword = watch('password');

  const handleRegister = async (data: RegisterFormData) => {
    clearError();
    clearErrors();

    // Ensure role is selected
    if (!selectedRole) {
      setError('role', {
        type: 'manual',
        message: 'Please select your account type',
      });
      return;
    }

    // Ensure terms are accepted
    if (!acceptTerms) {
      setError('acceptTerms', {
        type: 'manual',
        message: 'You must accept the terms and conditions',
      });
      return;
    }

    try {
      await registerUser({
        ...data,
        role: selectedRole,
        acceptTerms,
      });

      // Success notification
      toast.success('Account created successfully! Please check your email to verify your account.');

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
        if (err.status === 409) {
          setError('email', {
            type: 'manual',
            message: 'An account with this email already exists.',
          });
        } else if (err.status === 422 && err.errors) {
          // Handle field-specific validation errors from backend
          Object.entries(err.errors).forEach(([field, messages]) => {
            const fieldName = field === 'first_name' ? 'firstName' :
                            field === 'last_name' ? 'lastName' :
                            field === 'phone_number' ? 'phoneNumber' : field;
            
            if (fieldName in data) {
              setError(fieldName as keyof RegisterFormData, {
                type: 'manual',
                message: messages[0],
              });
            }
          });
        } else {
          toast.error(err.message || 'Registration failed. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const roleOptions = [
    {
      value: UserRole.JOB_SEEKER,
      label: 'Job Seeker',
      description: 'Looking for job opportunities',
      icon: User,
    },
    {
      value: UserRole.RECRUITER,
      label: 'Recruiter',
      description: 'Hiring talent for your company',
      icon: Briefcase,
    },
  ];

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-neutral-600">
          Join Jobifies and start your career journey
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6" noValidate>
        {/* Account Type Selection */}
        <div className="space-y-3">
          <label className="form-label">
            Account Type <span className="text-error-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(option.value);
                    clearErrors('role');
                  }}
                  disabled={isFormLoading}
                  className={`
                    relative flex items-center p-4 border-2 rounded-lg text-left transition-all
                    ${isSelected 
                      ? 'border-primary-500 bg-primary-50 text-primary-900' 
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }
                    ${isFormLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${errors.role ? 'border-error-500' : ''}
                  `}
                >
                  <Icon className={`
                    w-6 h-6 mr-3 
                    ${isSelected ? 'text-primary-600' : 'text-neutral-400'}
                  `} />
                  <div className="flex-1">
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-sm opacity-75">{option.description}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="form-error" role="alert">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First name"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            autoComplete="given-name"
            required
            disabled={isFormLoading}
            error={errors.firstName}
            {...register('firstName')}
          />

          <FormField
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            autoComplete="family-name"
            required
            disabled={isFormLoading}
            error={errors.lastName}
            {...register('lastName')}
          />
        </div>

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

        {/* Phone Field (Optional) */}
        <FormField
          label="Phone number"
          name="phoneNumber"
          type="tel"
          placeholder="Enter your phone number (optional)"
          autoComplete="tel"
          disabled={isFormLoading}
          error={errors.phoneNumber}
          leftIcon={<Phone className="w-4 h-4" />}
          helpText="Optional - for account recovery and important notifications"
          {...register('phoneNumber')}
        />

        {/* Password Field */}
        <FormField
          label="Password"
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
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
          disabled={isFormLoading}
          error={errors.confirmPassword}
          leftIcon={<Lock className="w-4 h-4" />}
          {...register('confirmPassword')}
        />

        {/* Terms & Conditions */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked) {
                  clearErrors('acceptTerms');
                }
              }}
              disabled={isFormLoading}
              className={`
                mt-0.5 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2
                ${errors.acceptTerms ? 'border-error-500' : ''}
              `}
            />
            <div className="text-sm">
              <span className="text-neutral-700">
                I agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-primary-600 hover:text-primary-500 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-primary-600 hover:text-primary-500 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  Privacy Policy
                </Link>
              </span>
              {errors.acceptTerms && (
                <p className="mt-1 text-error-600 text-sm" role="alert">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </label>

          {/* Marketing Consent (Optional) */}
          <InfoAlert>
            By creating an account, you may receive job alerts and career opportunities via email. 
            You can unsubscribe at any time.
          </InfoAlert>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isFormLoading}
          loadingText="Creating account..."
          disabled={isFormLoading || !acceptTerms || !selectedRole}
        >
          Create account
        </Button>

        {/* Social Register Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Google Register */}
            <Button
              type="button"
              variant="ghost"
              disabled={isFormLoading}
              onClick={() => {
                toast('Social registration coming soon!', { icon: '🚧' });
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

            {/* LinkedIn Register */}
            <Button
              type="button"
              variant="ghost"
              disabled={isFormLoading}
              onClick={() => {
                toast('Social registration coming soon!', { icon: '🚧' });
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

        {/* Login Link */}
        {showLoginLink && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </form>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">
          Your information is encrypted and secure. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;