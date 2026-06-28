'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminAuth } from '../context/auth-context';

const PUBLIC_PATHS = ['/login'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading, user } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!accessToken) {
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.replace('/login');
        }
      } else if (user && user.role !== 'ADMIN') {
        router.replace('/login');
      }
    }
  }, [isLoading, accessToken, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!accessToken || (user && user.role !== 'ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
