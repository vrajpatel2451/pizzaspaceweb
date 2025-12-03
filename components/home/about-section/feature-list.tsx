"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Leaf, Truck, Award, Check } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Only the finest ingredients from trusted suppliers",
    gradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
  },
  {
    icon: Leaf,
    title: "Fresh Daily",
    description: "Made fresh every day with homemade dough",
    gradient: "from-green-500 to-emerald-600",
    iconColor: "text-green-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Hot and fresh at your door in 30 minutes",
    gradient: "from-blue-500 to-cyan-600",
    iconColor: "text-blue-500",
  },
];

interface FeatureItemProps {
  feature: Feature;
  index: number;
  isVisible: boolean;
}

function FeatureItem({ feature, index, isVisible }: FeatureItemProps) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "group flex items-start gap-4 transition-all duration-500 motion-reduce:transition-none hover:translate-x-2 motion-reduce:hover:translate-x-0",
        isVisible ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-5"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon container */}
      <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform duration-400 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {/* Gradient background ring */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm motion-reduce:transition-none`} />

        {/* Icon box */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 shadow-md shadow-black/5 dark:shadow-black/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-black/10 dark:group-hover:shadow-black/30 transition-all duration-300 motion-reduce:transition-none">
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100", feature.iconColor)} />
        </div>

        {/* Animated check badge */}
        <div
          className={cn(
            "absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 motion-reduce:transition-none",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}
          style={{ transitionDelay: `${500 + index * 100}ms` }}
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <h4 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 motion-reduce:transition-none">
          {feature.title}
        </h4>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function FeatureList() {
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
      { rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-5 sm:space-y-6">
      {features.map((feature, index) => (
        <FeatureItem key={feature.title} feature={feature} index={index} isVisible={isVisible} />
      ))}
    </div>
  );
}

// Compact feature pills for inline display
export function FeaturePills() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pillFeatures = [
    { icon: Award, label: "Award Winning" },
    { icon: Leaf, label: "Fresh Ingredients" },
    { icon: Truck, label: "Fast Delivery" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap gap-2 sm:gap-3">
      {pillFeatures.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 dark:bg-navy-800 rounded-full border border-gray-100 dark:border-navy-700 text-xs sm:text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
            style={{ transitionDelay: `${400 + index * 100}ms` }}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
