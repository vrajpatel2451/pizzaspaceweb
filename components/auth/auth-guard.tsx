'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isHydrated, isLoading, router]);

  if (!isHydrated || isLoading) {
    return fallback || <AuthLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return fallback || <AuthLoadingSkeleton />;
  }

  return <>{children}</>;
}

function AuthLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
