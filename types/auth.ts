import { UserResponse } from './user';

// Auth store state interface
export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

// Auth store actions interface
export interface AuthActions {
  setUser: (user: UserResponse | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: UserResponse, token: string) => void;
  logout: () => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

// Combined store type
export type AuthStore = AuthState & AuthActions;

// Token storage keys
export const AUTH_STORAGE_KEY = 'pizzaspace-auth';
