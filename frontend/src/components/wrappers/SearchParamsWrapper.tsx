'use client';

import { Suspense } from 'react';

interface SearchParamsWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SearchParamsWrapper({ children, fallback }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={fallback || <div className="text-center">Loading...</div>}>
      {children}
    </Suspense>
  );
}