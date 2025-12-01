'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { getProfile } from '@/lib/api/auth';

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ isInitialized: false });

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { token, isHydrated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isHydrated) return;

      if (token) {
        setLoading(true);
        try {
          const response = await getProfile();
          if (response.statusCode === 200 && response.data) {
            setUser(response.data);
          } else {
            // Token invalid, clear auth
            logout();
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, [isHydrated, token, setUser, setLoading, logout]);

  return (
    <AuthContext.Provider value={{ isInitialized: isHydrated }}>
      {children}
    </AuthContext.Provider>
  );
}
