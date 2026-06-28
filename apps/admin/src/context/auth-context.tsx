'use client';

import * as React from 'react';
import { UserResponse } from '@mfc-platform/types';

interface AdminAuthContextValue {
  accessToken: string | null;
  user: UserResponse | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: UserResponse) => void;
  logout: () => void;
}

const AdminAuthContext = React.createContext<AdminAuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'admin_access_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER: 'admin_user',
};

function getStoredTokens() {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (accessToken && refreshToken && user) {
    return { accessToken, refreshToken, user: JSON.parse(user) as UserResponse };
  }
  return null;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const stored = getStoredTokens();
    if (stored) {
      setAccessToken(stored.accessToken);
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  const clearTokens = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setAccessToken(null);
    setUser(null);
  };

  const login = (accessToken: string, refreshToken: string, userData: UserResponse) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AdminAuthContext.Provider value={{ accessToken, user, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = React.useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}