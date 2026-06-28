'use client';

import { AdminAuthProvider } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </AdminAuthProvider>
  );
}
