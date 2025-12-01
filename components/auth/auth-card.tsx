'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, className, footer }: AuthCardProps) {
  return (
    <Card className={cn('w-full max-w-md mx-auto shadow-lg', className)}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  );
}
