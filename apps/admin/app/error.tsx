"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m6.98 4H7.02a2 2 0 01-2-2V7a2 2 0 012-2h10.96a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} variant="primary">Try Again</Button>
          <a href="/dashboard" className="inline-flex items-center justify-center h-10 px-4 text-sm rounded-md border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 transition-colors duration-150">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}