import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth";
import { AuthHeader } from "@/components/auth/auth-header";

export const metadata: Metadata = {
  title: "Create Account - Pizza Space",
  description: "Create a new Pizza Space account",
};

interface RegisterPageProps {
  searchParams: Promise<{ returnUrl?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const redirectTo = params.returnUrl || "/";

  return (
    <div className="w-full max-w-md">
      {/* Skip Link for Accessibility */}
      <a
        href="#register-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        Skip to registration form
      </a>

      {/* Premium Auth Header */}
      <Link
        href="/"
        className="block focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
      >
        <AuthHeader
          badge="Pizza Space - Join Us"
          headline="Create Account"
          highlightedWord="Account"
          subheadline="Join us for fresh pizzas delivered hot to your door."
        />
      </Link>

      {/* Register Form - Uses its own Card wrapper */}
      <div id="register-form">
        <RegisterForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
