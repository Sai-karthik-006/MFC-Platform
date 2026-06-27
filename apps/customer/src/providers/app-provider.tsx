'use client';

import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { CartProvider } from '../context/cart-context';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <CartProvider>{children}</CartProvider>
    </QueryProvider>
  );
}
