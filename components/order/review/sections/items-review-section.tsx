"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemReviewCard } from "../cards/item-review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItemsReviewSectionProps } from "../types";

export function ItemsReviewSection({
  items,
  control,
  errors,
}: ItemsReviewSectionProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No items to review
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.itemId}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: index * 0.08 + 0.1,
                }}
              >
                <ItemReviewCard
                  item={item}
                  index={index}
                  control={control}
                  errors={errors}
                />
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
