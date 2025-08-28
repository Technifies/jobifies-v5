'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { FormFieldError } from '@/types/auth';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  error?: FormFieldError;
  success?: boolean;
  helpText?: string;
  className?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    required = false,
    disabled = false,
    error,
    success = false,
    helpText,
    className,
    autoComplete,
    'aria-describedby': ariaDescribedBy,
    onChange,
    onBlur,
    onFocus,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const fieldId = name;
    const errorId = `${name}-error`;
    const helpId = `${name}-help`;
    
    const describedBy = [
      ariaDescribedBy,
      error ? errorId : null,
      helpText ? helpId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={clsx('space-y-2', className)}>
        {/* Label */}
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && (
            <span className="text-error-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type={inputType}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            className={clsx(
              'form-input',
              {
                'form-input-error': error,
                'pr-12': isPassword || success,
                'border-success-500 focus:border-success-500 focus:ring-success-500': success && !error,
                'opacity-50 cursor-not-allowed': disabled,
              }
            )}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:text-neutral-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Success Icon */}
          {success && !error && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
          )}

          {/* Error Icon */}
          {error && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="w-5 h-5 text-error-500" />
            </div>
          )}
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <p id={helpId} className="text-sm text-neutral-600">
            {helpText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p id={errorId} className="form-error" role="alert">
            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;