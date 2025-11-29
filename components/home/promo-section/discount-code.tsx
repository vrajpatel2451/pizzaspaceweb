'use client';

import React, { useState } from 'react';

interface DiscountCodeProps {
  code: string;
}

export function DiscountCode({ code }: DiscountCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-wide text-white/80">
        Promo Code:
      </p>
      <div className="inline-flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
        {/* Code Display */}
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span className="text-xl font-bold tracking-wider text-orange-600 lg:text-2xl">
            {code}
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="group relative flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-700 active:scale-95"
          aria-label="Copy promo code"
        >
          {copied ? (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Tooltip */}
        {copied && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-1 text-xs text-white shadow-lg">
            Code copied to clipboard!
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
}
