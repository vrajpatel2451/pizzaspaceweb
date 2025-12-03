import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Sign In | Pizza Space",
  description:
    "Sign in to your Pizza Space account to order delicious pizzas, track your orders, and manage your profile.",
  keywords: [
    "pizza space login",
    "sign in",
    "pizza account",
    "order pizza online",
    "pizza space account",
  ],
  alternates: {
    canonical: "https://pizzaspace.co.uk/login",
  },
  openGraph: {
    title: "Sign In | Pizza Space",
    description:
      "Sign in to your Pizza Space account to order delicious pizzas.",
    url: "https://pizzaspace.co.uk/login",
    siteName: "Pizza Space",
    images: [
      {
        url: "https://pizzaspace.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sign In to Pizza Space",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Pizza Space",
    description:
      "Sign in to your Pizza Space account to order delicious pizzas.",
    images: ["https://pizzaspace.co.uk/og-image.jpg"],
    creator: "@pizzaspace",
    site: "@pizzaspace",
  },
};

interface LoginPageProps {
  searchParams: Promise<{ returnUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.returnUrl || "/";
  console.log("Redirect to made params", params, redirectTo);

  return (
    <>
      <LoginPageJsonLd />
      <div className="w-full max-w-md">
        {/* Skip Link for Accessibility */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        Skip to login form
      </a>

      {/* Premium Auth Header */}
      <Link
        href="/"
        className="block focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
      >
        <AuthHeader
          badge="Pizza Space - Welcome"
          headline="Welcome Back"
          highlightedWord="Back"
          subheadline="Sign in to continue your delicious journey with us."
        />
      </Link>

      {/* Login Form - Uses its own Card wrapper */}
      <div id="login-form">
        <LoginForm redirectTo={redirectTo} />
      </div>

      {/* Bottom Terms Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 px-4">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-orange-600 dark:text-orange-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-orange-600 dark:text-orange-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
      </div>
    </>
  );
}
