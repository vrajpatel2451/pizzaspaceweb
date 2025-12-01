'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoading } = useAuthStore();
  const { getCartIds } = useCartStore();

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams();

      // Add return URL
      searchParams.set('returnUrl', currentPath);

      // Add cart context if cart has items
      const cartIds = getCartIds();
      if (cartIds.length > 0) {
        searchParams.set('hasCart', 'true');
      }

      router.push(`/login?${searchParams.toString()}`);
    }
  }, [isAuthenticated, isHydrated, isLoading, router, getCartIds]);

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
