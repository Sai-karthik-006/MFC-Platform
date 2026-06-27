import type { ReactNode } from 'react';

export interface NavigationItem {
  href: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  requiresAuth?: boolean;
  protected?: boolean;
  group?: 'public' | 'auth' | 'admin' | 'delivery';
}

export const primaryNav: NavigationItem[] = [
  { href: '/', label: 'Home', isActive: true },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout', requiresAuth: true, protected: true },
];

export const secondaryNav: NavigationItem[] = [
  { href: '/auth/login', label: 'Login' },
  { href: '/profile', label: 'Profile', protected: true },
];

export const adminNav: NavigationItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', group: 'admin' },
  { href: '/admin/products', label: 'Products', group: 'admin' },
  { href: '/admin/orders', label: 'Orders', group: 'admin' },
  { href: '/admin/users', label: 'Users', group: 'admin' },
];

export const deliveryNav: NavigationItem[] = [
  { href: '/delivery/orders', label: 'Orders', group: 'delivery' },
  { href: '/delivery/tracking', label: 'Tracking', group: 'delivery' },
];
