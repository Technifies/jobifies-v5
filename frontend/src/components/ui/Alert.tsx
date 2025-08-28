'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva(
  'rounded-md p-4 border flex items-start space-x-3',
  {
    variants: {
      variant: {
        success: 'bg-success-50 border-success-200 text-success-800',
        error: 'bg-error-50 border-error-200 text-error-800',
        warning: 'bg-warning-50 border-warning-200 text-warning-800',
        info: 'bg-info-50 border-info-200 text-info-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const iconColorMap = {
  success: 'text-success-500',
  error: 'text-error-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
};

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  closable = false,
  className,
}) => {
  const Icon = iconMap[variant!];
  const iconColor = iconColorMap[variant!];

  return (
    <div className={clsx(alertVariants({ variant }), className)} role="alert">
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={clsx('w-5 h-5', iconColor)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {/* Close Button */}
      {(closable || onClose) && (
        <div className="flex-shrink-0">
          <button
            type="button"
            className={clsx(
              'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              {
                'text-success-500 hover:bg-success-100 focus:ring-success-500': variant === 'success',
                'text-error-500 hover:bg-error-100 focus:ring-error-500': variant === 'error',
                'text-warning-500 hover:bg-warning-100 focus:ring-warning-500': variant === 'warning',
                'text-info-500 hover:bg-info-100 focus:ring-info-500': variant === 'info',
              }
            )}
            onClick={onClose}
            aria-label="Close alert"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

// Specific alert variants for easier usage
export const SuccessAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="success" {...props} />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="error" {...props} />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="warning" {...props} />
);

export const InfoAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert variant="info" {...props} />
);

export { Alert, alertVariants };
export default Alert;