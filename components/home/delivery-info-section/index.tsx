"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Clock, Truck, Gift, CheckCircle } from "lucide-react";
import { InfoCard } from "./info-card";

export function DeliveryInfoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const deliveryInfo = [
    {
      icon: Clock,
      title: "09:00 - 23:00",
      description: "Open Daily",
    },
    {
      icon: Truck,
      title: "30-45 min",
      description: "Fast Delivery",
    },
    {
      icon: Gift,
      title: "Orders $30+",
      description: "Free Delivery",
    },
    {
      icon: CheckCircle,
      title: "Always Fresh",
      description: "Quality Guaranteed",
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full bg-amber-50 py-12 sm:py-16 lg:py-20 dark:bg-navy-900"
      aria-labelledby="delivery-info-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={cn(
            "mb-8 sm:mb-12 text-center transition-all duration-600 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2
            id="delivery-info-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white"
          >
            Our Delivery Service
          </h2>
          <p
            className={cn(
              "mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-opacity duration-500 motion-reduce:transition-none",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Fast, reliable, and fresh pizza delivered to your door
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deliveryInfo.map((info, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-500 motion-reduce:transition-none",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
              )}
              style={{ transitionDelay: `${100 + index * 120}ms` }}
            >
              <InfoCard
                icon={info.icon}
                title={info.title}
                description={info.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
