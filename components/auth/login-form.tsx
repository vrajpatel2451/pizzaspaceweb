"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { setAuthCookie } from "@/lib/actions/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export function LoginForm({ redirectTo = "/", onSuccess }: LoginFormProps) {
  console.log("Redirect to", redirectTo, encodeURIComponent(redirectTo));

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Focus management - focus on first error field
  useEffect(() => {
    if (errors.email) {
      setFocus("email");
    } else if (errors.password) {
      setFocus("password");
    }
  }, [errors, setFocus]);

  // Focus on API error region when error occurs
  useEffect(() => {
    if (apiError) {
      // Announce error to screen readers
      const errorElement = document.getElementById("api-error-alert");
      errorElement?.focus();
    }
  }, [apiError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);

      // Call the login API
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Check if the response is successful
      if (response.statusCode === 201 && response.data) {
        // Store user and token in auth store
        login(response.data.user, response.data.token);

        // Set the auth cookie for server-side authentication
        await setAuthCookie(response.data.token, true);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Refresh the router to re-trigger middleware with the new cookie
        router.refresh();

        // Redirect to the specified page
        router.push(redirectTo);
      } else {
        // Handle API error
        setApiError(response.errorMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl text-slate-900 dark:text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API Error Display */}
          {apiError && (
            <div
              id="api-error-alert"
              tabIndex={-1}
              className="flex items-start gap-2 p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-lg text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/50"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <AlertCircle
                className="size-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{apiError}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
              <span className="sr-only">(required)</span>
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="size-4" aria-hidden="true" />}
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                leftIcon={<Lock className="size-4" aria-hidden="true" />}
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                aria-required="true"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            aria-label="Sign in to your account"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-2">
        <p className="text-center text-sm text-muted-foreground w-full">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?returnUrl=${encodeURIComponent(redirectTo)}`}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
