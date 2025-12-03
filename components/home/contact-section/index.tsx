import Link from 'next/link';
import { ContactInfo } from './contact-info';
import { ContactForm } from './contact-form';
import { Mail } from 'lucide-react';

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Mail className="w-3.5 h-3.5" />
              Get In Touch
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Contact{" "}
            <span className="text-orange-500 relative">
              Us
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 25 0, 50 8 T 100 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question or want to place an order? We&apos;re here to help you 24/7
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>

        {/* Contact Grid - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Info & Map */}
          <div className="order-2 lg:order-1">
            <ContactInfo />
          </div>

          {/* Right Column - Contact Form */}
          <div className="order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 sm:mt-16 text-center space-y-6">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-orange-50 dark:bg-orange-500/10 px-6 py-4 rounded-full border border-orange-200 dark:border-orange-500/20">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Need immediate assistance?
            </p>
            <div className="flex items-center gap-4">
              <a
                href="tel:+15551234567"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Call: +1 (555) 123-4567
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="mailto:hello@pizzaspace.com"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>

          {/* Visit Contact Page Link */}
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <span>Visit our full contact page for more ways to reach us</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
