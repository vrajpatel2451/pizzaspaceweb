import Link from "next/link";
import type { PolicyListItem } from "@/types";

interface FooterBottomProps {
  policies?: PolicyListItem[];
}

// Fallback legal links if no policies from backend
const fallbackLegalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

// Payment method icons as simple SVG components
function VisaIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" aria-label="Visa">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        d="M19.5 21h-3l1.875-11.5h3L19.5 21zm7.5-11.5l-2.813 7.906-.313-1.531-.937-4.75c-.157-.625-.625-.625-1.25-.625h-4.75l-.062.25c.937.25 2 .625 2.625 1.031l2.188 8.219h3.125l4.75-10.5h-2.563zm10.063 7.75c.25.594 1.125 2.875 1.125 2.875s.25-.625.375-1l.625-2.75c.125-.5.375-1.125.5-1.5l.25 1.375s.563 2.688.688 3.25h-2.375l-.563-2.25h-2.875l-.438 2.25h-2.438l2.438-10.5h2.938c.625 0 1.063.188 1.25.75l.5 5.5zm-2.563-.75h1.938l-.438-2.125c-.063-.25-.125-.563-.188-.875l-.187.875-.313 2.125h-.812zm-18.625 4.5h-2.938l-3.125-8.188c-.125-.438-.437-.688-.875-.813-1-.375-2.063-.625-3.188-.75l.063-.25h4.813c.625 0 1.125.438 1.25 1.063l1.188 6.188 2.938-7.25h3.125L15.875 21z"
        fill="white"
      />
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <circle cx="18" cy="16" r="8" fill="#EB001B" />
      <circle cx="30" cy="16" r="8" fill="#F79E1B" />
      <path
        d="M24 9.2a8 8 0 0 0-2.4 5.8c0 2.3 1 4.4 2.4 5.8a8 8 0 0 0 2.4-5.8c0-2.3-1-4.4-2.4-5.8z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" aria-label="American Express">
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <path
        d="M8 14h4l.5-1.5h1l.5 1.5h8v-1.2l.7 1.2h4l.7-1.2v1.2h16v-8H8v8zm32 4H24v1.2l-.7-1.2h-4l-.7 1.2v-1.2H11.5l-.5 1.5h-1l-.5-1.5H8v8h32v-8z"
        fill="white"
      />
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" aria-label="Apple Pay">
      <rect width="48" height="32" rx="4" fill="#000" />
      <path
        d="M14.5 11c-.6.7-.9 1.6-.8 2.5.8.1 1.6-.3 2.2-.9.6-.6.9-1.5.8-2.4-.8 0-1.6.4-2.2.8zm2.4 1.3c-1.2 0-2.4.8-3 .8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.4 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.2 0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6l-.2-.4zm7.4.7h2.4l5.6 8.9v-8.9h2.3v11.3h-2.5L26.6 15v9.3h-2.3V13z"
        fill="white"
      />
    </svg>
  );
}

function GooglePayIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-6 w-auto" aria-label="Google Pay">
      <rect width="48" height="32" rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M22.7 16.4v3.9h-1.2v-9.7h3.3c.8 0 1.5.3 2 .8.6.5.8 1.2.8 2 0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8h-2.1v.2zm0-4.6v3.3h2.1c.5 0 .9-.2 1.2-.5.3-.3.5-.7.5-1.2 0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.2-.5h-2.1z" fill="#5F6368" />
      <path d="M31.3 13.5c.9 0 1.6.2 2.1.7.5.5.8 1.1.8 2v4.1h-1.2v-.9c-.4.7-1 1.1-1.9 1.1-.7 0-1.2-.2-1.7-.6-.4-.4-.6-.9-.6-1.4 0-.6.2-1.1.6-1.4.4-.4 1-.6 1.8-.6.7 0 1.3.2 1.7.5v-.4c0-.4-.2-.8-.5-1-.3-.3-.7-.4-1.2-.4-.7 0-1.3.3-1.6.9l-1-.6c.5-.8 1.3-1.2 2.4-1.2l.3.2zm-1.5 4.8c0 .3.1.5.4.7.2.2.5.3.9.3.5 0 .9-.2 1.2-.5.4-.3.5-.7.5-1.2-.3-.3-.8-.5-1.5-.5-.5 0-.9.1-1.2.4-.2.2-.3.5-.3.8z" fill="#5F6368" />
      <path d="M40.5 13.6l-3.9 9h-1.3l1.4-3.1-2.5-5.9h1.4l1.7 4.3 1.7-4.3h1.5z" fill="#5F6368" />
      <path d="M17.2 16c0-.3 0-.6-.1-.9h-5v1.8h2.9c-.1.6-.4 1.1-.9 1.4v1.2h1.5c.9-.8 1.4-2 1.4-3.5h.2z" fill="#4285F4" />
      <path d="M12.1 20.4c1.2 0 2.3-.4 3-1.1l-1.5-1.2c-.4.3-.9.4-1.5.4-1.2 0-2.2-.8-2.5-1.8H8v1.2c.8 1.5 2.3 2.5 4.1 2.5z" fill="#34A853" />
      <path d="M9.6 16.7c-.2-.5-.2-1.1 0-1.6V13.9H8c-.5 1.1-.5 2.4 0 3.5l1.6-1.2v.5z" fill="#FBBC04" />
      <path d="M12.1 13.3c.7 0 1.3.2 1.8.7l1.3-1.3c-.8-.8-1.9-1.2-3.1-1.2-1.8 0-3.4 1-4.1 2.5l1.6 1.2c.3-1.1 1.3-1.9 2.5-1.9z" fill="#EA4335" />
    </svg>
  );
}

const paymentMethods = [
  { name: "Visa", Icon: VisaIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "American Express", Icon: AmexIcon },
  { name: "Apple Pay", Icon: ApplePayIcon },
  { name: "Google Pay", Icon: GooglePayIcon },
];

export function FooterBottom({ policies = [] }: FooterBottomProps) {
  const currentYear = new Date().getFullYear();

  // Use backend policies if available, otherwise use fallback
  const legalLinks = policies.length > 0
    ? policies.map((policy) => ({
        label: policy.name,
        href: `/policies/${policy.slug}`,
      }))
    : fallbackLegalLinks;

  return (
    <div className="border-t border-navy-800 mt-12 pt-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} PizzaSpace. All rights reserved.
          </p>
          <span className="hidden sm:inline text-gray-600">|</span>
          <p className="text-gray-500 text-sm">
            Made with{" "}
            <span className="text-primary-500" aria-label="love">
              love
            </span>{" "}
            and fresh ingredients.
          </p>
        </div>

        {/* Legal Links */}
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-gray-500 hover:text-gray-300
                text-sm transition-colors duration-200
                relative after:absolute after:bottom-0 after:left-0
                after:w-0 after:h-px after:bg-primary-500
                hover:after:w-full after:transition-all after:duration-300
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Payment Methods */}
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs mr-1">We accept:</span>
          <div className="flex items-center gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
              >
                <method.Icon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
