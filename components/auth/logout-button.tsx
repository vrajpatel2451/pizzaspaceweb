"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { clearAuthCookie } from "@/lib/actions/auth-actions";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  className,
  showIcon = true,
  children,
}: LogoutButtonProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Clear the auth cookie
      await clearAuthCookie();

      // Clear the Zustand auth store
      logout();

      // Refresh the router to re-trigger middleware
      router.refresh();

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if cookie clearing fails, still clear local state and redirect
      logout();
      router.push("/");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      aria-label="Sign out"
    >
      {showIcon && <LogOut className="size-4 mr-2" aria-hidden="true" />}
      {children || "Sign Out"}
    </Button>
  );
}
