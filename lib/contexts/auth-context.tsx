'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { getProfile, loginUser, registerUser } from '@/lib/api/auth';
import { LoginUserPayload, RegisterUserPayload } from '@/types/user';
import { APIResponse } from '@/types/api';
import { UserResponseWithToken } from '@/types/user';

interface AuthContextType {
  isInitialized: boolean;
  loginWithCart: (email: string, password: string, cartIds?: string[]) => Promise<APIResponse<UserResponseWithToken | null>>;
  registerWithCart: (payload: RegisterUserPayload) => Promise<APIResponse<UserResponseWithToken | null>>;
}

const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
  loginWithCart: async () => ({ statusCode: 500, data: null, errorMessage: 'Not initialized' }),
  registerWithCart: async () => ({ statusCode: 500, data: null, errorMessage: 'Not initialized' }),
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { token, isHydrated, setUser, setLoading, logout, login } = useAuthStore();

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

  const loginWithCart = async (
    email: string,
    password: string,
    cartIds?: string[]
  ): Promise<APIResponse<UserResponseWithToken | null>> => {
    setLoading(true);
    try {
      const payload: LoginUserPayload = {
        email,
        password,
        ...(cartIds && cartIds.length > 0 ? { cartIds } : {}),
      };

      const response = await loginUser(payload);

      if (response.statusCode === 200 && response.data) {
        login(response.data.user, response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Login with cart failed:', error);
      return {
        statusCode: 500,
        data: null,
        errorMessage: 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  };

  const registerWithCart = async (
    payload: RegisterUserPayload
  ): Promise<APIResponse<UserResponseWithToken | null>> => {
    setLoading(true);
    try {
      const response = await registerUser(payload);

      if (response.statusCode === 200 && response.data) {
        login(response.data.user, response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Register with cart failed:', error);
      return {
        statusCode: 500,
        data: null,
        errorMessage: 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isInitialized: isHydrated, loginWithCart, registerWithCart }}>
      {children}
    </AuthContext.Provider>
  );
}
