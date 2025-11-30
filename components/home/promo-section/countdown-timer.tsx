'use client';

import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    // Mark as mounted and set up timer
    setMounted(true);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-3 lg:gap-4">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg lg:p-6"
          >
            <span className="text-2xl font-bold text-orange-600 lg:text-4xl">
              00
            </span>
            <span className="mt-1 text-xs font-medium text-gray-600 lg:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  // Format time for screen readers
  const timeLeftText = `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`;

  return (
    <>
      {/* Screen reader announcement - updates every minute to avoid being too chatty */}
      <div className="sr-only" role="timer" aria-live="polite" aria-atomic="true">
        {timeLeft.seconds === 0 ? timeLeftText : null}
      </div>

      <div className="grid grid-cols-4 gap-3 lg:gap-4" aria-hidden="true">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-lg transition-all hover:scale-105 lg:p-6"
            style={{
              animation: mounted ? `slideUp 0.5s ease-out ${index * 0.1}s both` : 'none',
            }}
          >
            <span className="text-2xl font-bold text-orange-600 lg:text-4xl">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-xs font-medium text-gray-600 lg:text-sm">
              {unit.label}
            </span>
          </div>
        ))}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .transition-all,
          [style*="animation"] {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
