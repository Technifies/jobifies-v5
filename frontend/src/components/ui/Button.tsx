'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

// Button variants using CVA
const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'text-primary-700 bg-primary-50 border-primary-200 hover:bg-primary-100 focus:ring-primary-500',
        ghost: 'text-neutral-700 bg-transparent border-neutral-300 hover:bg-neutral-50 focus:ring-primary-500',
        success: 'text-white bg-success-600 border-transparent hover:bg-success-700 focus:ring-success-500',
        danger: 'text-white bg-error-600 border-transparent hover:bg-error-700 focus:ring-error-500',
        link: 'text-primary-600 underline-offset-4 hover:underline border-none bg-transparent p-0 h-auto font-normal',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base font-semibold',
        xl: 'px-8 py-4 text-lg font-semibold',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    disabled,
    children,
    type = 'button',
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          buttonVariants({ variant, size, fullWidth }),
          {
            'opacity-50 cursor-not-allowed': isDisabled,
            'pointer-events-none': loading,
          },
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Loader2 
            className={clsx(
              'animate-spin',
              size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
              children || loadingText ? 'mr-2' : ''
            )}
            aria-hidden="true"
          />
        )}

        {/* Left Icon */}
        {!loading && leftIcon && (
          <span className={clsx(
            'inline-flex',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
            children ? 'mr-2' : ''
          )}>
            {leftIcon}
          </span>
        )}

        {/* Button Content */}
        <span className={loading ? 'opacity-70' : ''}>
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right Icon */}
        {!loading && rightIcon && (
          <span className={clsx(
            'inline-flex',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
            children ? 'ml-2' : ''
          )}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Specific button variants for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
);

export const SuccessButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="success" {...props} />
);

export const DangerButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="danger" {...props} />
);

export const LinkButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="link" {...props} />
);

PrimaryButton.displayName = 'PrimaryButton';
SecondaryButton.displayName = 'SecondaryButton';
GhostButton.displayName = 'GhostButton';
SuccessButton.displayName = 'SuccessButton';
DangerButton.displayName = 'DangerButton';
LinkButton.displayName = 'LinkButton';

export { Button, buttonVariants };
export default Button;