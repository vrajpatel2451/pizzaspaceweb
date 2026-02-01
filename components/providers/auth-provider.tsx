"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getProfile } from "@/lib/api/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { token, isHydrated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate stored token against server on hydration
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isHydrated || !token) return;

      setLoading(true);
      try {
        const response = await getProfile();
        if (response.statusCode === 200 && response.data) {
          setUser(response.data);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isHydrated, token, setUser, setLoading, logout]);

  // Show nothing until client has mounted and store has hydrated
  // This prevents hydration mismatches and flash of wrong content
  if (!mounted || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
