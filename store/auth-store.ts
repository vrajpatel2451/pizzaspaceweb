import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore, AUTH_STORAGE_KEY, AuthState } from '@/types/auth';

const initialState: Omit<AuthState, 'isHydrated'> & { isHydrated: boolean } = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      }),

      logout: () => set({
        ...initialState,
        isHydrated: true
      }),

      clearAuth: () => set(initialState),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);
