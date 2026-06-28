'use client';

import type { ReactNode } from 'react';
import { AppProvider } from './app-provider';
import { AuthProvider } from '../context/auth-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppProvider>
  );
}
