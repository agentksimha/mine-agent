import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiJson, getAuthToken, setAuthToken } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (!getAuthToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiJson<{ user: User }>('/auth/me');
        setUser(data.user);
      } catch {
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener('minerakshak:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('minerakshak:unauthorized', handleUnauthorized);
  }, []);

  const authenticate = async (path: string, body: object) => {
    const data = await apiJson<AuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(data.token);
    setUser(data.user);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: (name, email, password) => authenticate('/auth/register', { name, email, password }),
    logout: async () => {
      try {
        if (getAuthToken()) await apiJson('/auth/logout', { method: 'POST' });
      } finally {
        setAuthToken(null);
        setUser(null);
      }
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};

