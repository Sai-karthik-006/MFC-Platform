'use client';

import type { ReactNode } from 'react';
import { AppProvider } from './app-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <AppProvider>{children}</AppProvider>;
}
