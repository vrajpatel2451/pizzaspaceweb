"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryResponse } from "@/types";
import { cn } from "@/lib/utils";

interface MenuTabsProps {
  categories: CategoryResponse[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

interface TabItem {
  id: string;
  name: string;
}

export function MenuTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTabRect, setActiveTabRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Create tabs array with "all" first
  const tabs: TabItem[] = [
    { id: "all", name: "All" },
    ...categories.map((cat) => ({ id: cat._id, name: cat.name })),
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const newTab = tabs[newIndex];
    onCategoryChange(newTab.id);
    tabRefs.current.get(newTab.id)?.focus();
  };

  // Update active tab indicator position
  useEffect(() => {
    const activeButton = tabRefs.current.get(activeCategory);
    const container = containerRef.current;

    if (activeButton && container) {
      setActiveTabRect(activeButton.getBoundingClientRect());
      setContainerRect(container.getBoundingClientRect());
    }
  }, [activeCategory, categories]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      const activeButton = tabRefs.current.get(activeCategory);
      const container = containerRef.current;

      if (activeButton && container) {
        setActiveTabRect(activeButton.getBoundingClientRect());
        setContainerRect(container.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeCategory]);

  const setTabRef = (id: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(id, el);
    } else {
      tabRefs.current.delete(id);
    }
  };

  return (
    <div className="relative mb-10 sm:mb-14">
      {/* Scrollable container for mobile */}
      <div
        ref={containerRef}
        className="relative flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide sm:flex-wrap sm:justify-center"
        role="tablist"
        aria-label="Menu categories"
      >
        {/* Animated background indicator */}
        <AnimatePresence>
          {activeTabRect && containerRect && (
            <motion.div
              layoutId="activeTab"
              className="absolute bg-orange-500 rounded-full shadow-lg shadow-orange-500/25 dark:shadow-orange-500/15 hidden sm:block"
              initial={false}
              animate={{
                x: activeTabRect.left - containerRect.left,
                width: activeTabRect.width,
                height: activeTabRect.height,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              style={{
                top: activeTabRect.top - containerRect.top,
              }}
            />
          )}
        </AnimatePresence>

        {tabs.map((tab, index) => {
          const isActive = activeCategory === tab.id;

          return (
            <motion.button
              key={tab.id}
              ref={setTabRef(tab.id)}
              onClick={() => onCategoryChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              role="tab"
              aria-selected={isActive}
              aria-controls="menu-panel"
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                "relative px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 min-h-[44px] flex items-center justify-center z-10 touch-manipulation",
                // Mobile: show active state directly
                "sm:text-slate-600 sm:dark:text-slate-300 sm:hover:text-slate-900 sm:dark:hover:text-white",
                // Mobile active state
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 sm:bg-transparent sm:text-white sm:shadow-none"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sm:bg-transparent sm:dark:bg-transparent"
              )}
            >
              <span className="relative">
                {tab.name}
                {/* Active dot indicator for mobile */}
                {isActive && (
                  <motion.span
                    layoutId="activeDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full sm:hidden"
                  />
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Fade edges for scroll indication on mobile */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none sm:hidden" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none sm:hidden" />

      {/* Subtle divider line */}
      <div className="hidden sm:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-500/50 to-transparent rounded-full" />
    </div>
  );
}
