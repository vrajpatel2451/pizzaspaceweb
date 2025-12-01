'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthContextProvider } from '@/lib/contexts/auth-context';
import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing until client has mounted and store has hydrated
  // This prevents hydration mismatches and flash of wrong content
  if (!mounted || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
}
