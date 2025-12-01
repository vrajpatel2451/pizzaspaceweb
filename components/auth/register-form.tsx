"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { registerUser } from "@/lib/api/auth";
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

interface RegisterFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

type PasswordStrength = "weak" | "medium" | "strong" | null;

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return null;
  if (password.length < 6) return "weak";

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;

  if (password.length >= 10 && strengthScore >= 3) return "strong";
  if (password.length >= 8 && strengthScore >= 2) return "medium";
  return "weak";
};

const getStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case "weak":
      return "bg-destructive";
    case "medium":
      return "bg-orange-500";
    case "strong":
      return "bg-green-500";
    default:
      return "bg-muted";
  }
};

const getStrengthWidth = (strength: PasswordStrength): string => {
  switch (strength) {
    case "weak":
      return "w-1/3";
    case "medium":
      return "w-2/3";
    case "strong":
      return "w-full";
    default:
      return "w-0";
  }
};

export function RegisterForm({
  redirectTo = "/",
  onSuccess,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setFocus,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const password = watch("password");
  const passwordStrength = getPasswordStrength(password);

  // Focus management - focus on first error field
  useEffect(() => {
    if (errors.name) {
      setFocus("name");
    } else if (errors.email) {
      setFocus("email");
    } else if (errors.phone) {
      setFocus("phone");
    } else if (errors.password) {
      setFocus("password");
    } else if (errors.confirmPassword) {
      setFocus("confirmPassword");
    }
  }, [errors, setFocus]);

  // Focus on API error region when error occurs
  useEffect(() => {
    if (apiError) {
      const errorElement = document.getElementById("api-error-alert");
      errorElement?.focus();
    }
  }, [apiError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);

      // Call the register API
      const response = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Check if the response is successful
      if (response.statusCode === 201 && response.data) {
        // Auto-login: Store user and token in auth store
        login(response.data.user, response.data.token);

        // Set the auth cookie for server-side authentication
        await setAuthCookie(response.data.token, false);

        // Show success toast
        toast.success("Account created successfully!", {
          description: "You're now logged in!",
          duration: 5000,
        });

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Refresh the router to re-trigger middleware with the new cookie
        router.refresh();

        // Redirect to the original destination
        router.push(redirectTo);
      } else {
        // Handle API error
        setApiError(
          response.errorMessage || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl text-slate-900 dark:text-white">
          Create Account
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Sign up to start ordering delicious pizzas
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

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name
              <span className="sr-only">(required)</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              leftIcon={<User className="size-4" aria-hidden="true" />}
              error={errors.name?.message}
              aria-invalid={!!errors.name}
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
              autoComplete="name"
              {...register("name")}
            />
          </div>

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
              placeholder="you@example.com"
              leftIcon={<Mail className="size-4" aria-hidden="true" />}
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              {...register("email")}
            />
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number
              <span className="sr-only">(required)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+1 (555) 123-4567"
              leftIcon={<Phone className="size-4" aria-hidden="true" />}
              error={errors.phone?.message}
              aria-invalid={!!errors.phone}
              aria-required="true"
              aria-describedby={errors.phone ? "phone-error" : undefined}
              autoComplete="tel"
              {...register("phone")}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
              <span className="sr-only">(required)</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                leftIcon={<Lock className="size-4" aria-hidden="true" />}
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                aria-required="true"
                aria-describedby={
                  password && !errors.password
                    ? "password-strength password-error"
                    : errors.password
                    ? "password-error"
                    : undefined
                }
                autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password && !errors.password && (
              <div className="space-y-1.5" id="password-strength">
                <div
                  className="flex gap-1 h-1"
                  role="progressbar"
                  aria-label="Password strength"
                  aria-valuenow={
                    passwordStrength === "weak"
                      ? 33
                      : passwordStrength === "medium"
                      ? 66
                      : 100
                  }
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuetext={`Password strength: ${
                    passwordStrength || "none"
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${getStrengthColor(
                      passwordStrength
                    )} ${getStrengthWidth(passwordStrength)}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`h-full flex-1 bg-muted rounded-full transition-all duration-300`}
                    aria-hidden="true"
                  />
                </div>
                <p
                  className="text-xs text-muted-foreground flex items-start gap-1"
                  aria-live="polite"
                >
                  {passwordStrength === "strong" && (
                    <>
                      <CheckCircle2
                        className="size-3 text-green-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-green-600 dark:text-green-400">
                        Strong password
                      </span>
                    </>
                  )}
                  {passwordStrength === "medium" && (
                    <span className="text-orange-600 dark:text-orange-400">
                      Medium strength - add more variety
                    </span>
                  )}
                  {passwordStrength === "weak" && (
                    <span className="text-destructive">
                      Weak - use uppercase, lowercase, numbers, symbols
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
              <span className="sr-only">(required)</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                leftIcon={<Lock className="size-4" aria-hidden="true" />}
                error={errors.confirmPassword?.message}
                aria-invalid={!!errors.confirmPassword}
                aria-required="true"
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
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
            aria-label="Create your account"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          {/* Terms and Privacy Notice */}
          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </CardContent>

      <CardFooter className="pt-2">
        <p className="text-center text-sm text-muted-foreground w-full">
          Already have an account?{" "}
          <Link
            href={`/login?returnUrl=${encodeURIComponent(redirectTo)}`}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
