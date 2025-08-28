'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { checkPasswordStrength } from '@/lib/validation/schemas';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  className,
}) => {
  const analysis = checkPasswordStrength(password);
  
  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  const strengthColors = {
    weak: 'bg-error-500',
    fair: 'bg-warning-500',
    good: 'bg-primary-500',
    strong: 'bg-success-500',
  };

  const strengthLabels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  };

  const strengthTextColors = {
    weak: 'text-error-600',
    fair: 'text-warning-600',
    good: 'text-primary-600',
    strong: 'text-success-600',
  };

  return (
    <div className={clsx('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700">
            Password Strength
          </span>
          <span className={clsx('text-sm font-medium', strengthTextColors[analysis.strength])}>
            {strengthLabels[analysis.strength]}
          </span>
        </div>
        
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className={clsx(
              'h-2 rounded-full transition-all duration-300',
              strengthColors[analysis.strength]
            )}
            style={{ width: `${(analysis.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700">Requirements:</h4>
          <ul className="space-y-1">
            {Object.entries({
              'At least 8 characters': analysis.requirements.length,
              'Lowercase letter': analysis.requirements.lowercase,
              'Uppercase letter': analysis.requirements.uppercase,
              'Number': analysis.requirements.number,
              'Special character': analysis.requirements.special,
            }).map(([requirement, met]) => (
              <li
                key={requirement}
                className="flex items-center text-sm"
              >
                {met ? (
                  <Check className="w-4 h-4 text-success-500 mr-2" />
                ) : (
                  <X className="w-4 h-4 text-error-500 mr-2" />
                )}
                <span
                  className={met ? 'text-success-600' : 'text-neutral-600'}
                >
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback */}
      {analysis.feedback.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-neutral-700">Suggestions:</h4>
          <ul className="space-y-1">
            {analysis.feedback.map((feedback, index) => (
              <li key={index} className="text-sm text-neutral-600 flex items-center">
                <span className="w-1 h-1 bg-neutral-400 rounded-full mr-2" />
                {feedback}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;