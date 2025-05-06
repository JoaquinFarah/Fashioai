
import React from 'react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ size = 'default', className }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={cn(
        'spinner',
        sizeClasses[size] || sizeClasses.default,
        'border-secondary/30 border-t-secondary rounded-full animate-spin',
        className
      )}
    ></div>
  );
};

export default LoadingSpinner;
  