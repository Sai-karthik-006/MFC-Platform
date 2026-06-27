'use client';

import * as React from 'react';
import { Button } from '../ui/button';

interface ErrorPageProps {
  title?: string;
  description?: string;
  error?: Error;
  reset?: () => void;
}

export function ErrorPage({
  title = 'Something went wrong',
  description,
  error,
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      {description && <p className="mt-4 text-gray-600">{description}</p>}
      {error && <p className="mt-2 text-sm text-gray-500">{error.message}</p>}
      {reset && (
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      )}
    </div>
  );
}
