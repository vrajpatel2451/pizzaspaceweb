"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl" />
        {/* Pizza pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-white text-sm font-medium">Limited Time Offer</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-8">
            Subscribe to our newsletter and receive exclusive deals, new menu items, and pizza inspiration directly in your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              {isSuccess ? (
                <div className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-navy-900 font-medium">
                    Welcome to the PizzaSpace family!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your email address"
                      className={`
                        w-full h-12 sm:h-14 px-5 pr-12 rounded-full
                        bg-white text-navy-900 placeholder:text-navy-400
                        border-2 transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-white/30
                        ${error ? "border-red-400" : "border-transparent"}
                      `}
                      disabled={isPending}
                    />
                    <Send className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 sm:hidden" />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="
                      h-12 sm:h-14 px-8 rounded-full
                      bg-navy-900 text-white font-semibold
                      hover:bg-navy-800 active:scale-[0.98]
                      transition-all duration-200
                      disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                      shadow-lg hover:shadow-xl
                    "
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-white bg-red-500/20 backdrop-blur-sm rounded-lg px-4 py-2 mt-3 text-sm">
                {error}
              </p>
            )}
          </form>

          {/* Privacy note */}
          <p className="text-white/70 text-xs mt-4">
            No spam, ever. Unsubscribe anytime. By subscribing, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-white transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
