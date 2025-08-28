'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  centered?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-xl',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  centered = false,
}) => {
  const content = (
    <div className={clsx('flex items-center space-x-2', className)}>
      <Loader2 
        className={clsx(
          'animate-spin text-primary-600',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <span className={clsx(
          'text-neutral-600',
          textSizeClasses[size]
        )}>
          {text}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components for common use cases
export const PageLoading: React.FC<{ text?: string }> = ({ 
  text = 'Loading...' 
}) => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const ButtonLoading: React.FC<{ text?: string }> = ({ 
  text 
}) => (
  <LoadingSpinner size="sm" text={text} />
);

export const CardLoading: React.FC<{ text?: string }> = ({ 
  text = 'Loading...' 
}) => (
  <div className="flex justify-center items-center p-8">
    <LoadingSpinner size="md" text={text} />
  </div>
);

export const InlineLoading: React.FC<{ text?: string }> = ({ 
  text 
}) => (
  <LoadingSpinner size="sm" text={text} />
);

export default LoadingSpinner;