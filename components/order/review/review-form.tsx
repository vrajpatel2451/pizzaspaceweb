"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextArea } from "@/components/ui/textarea";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User, Mail, ShoppingBag, Truck, Package, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useReviewForm } from "./hooks/use-review-form";
import type { OrderReviewFormProps } from "./types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Tab icon mapping
const tabIcons: Record<string, React.ReactNode> = {
  order: <ShoppingBag className="w-4 h-4" />,
  rider: <Truck className="w-4 h-4" />,
  items: <Package className="w-4 h-4" />,
};

export function ReviewForm({
  order,
  existingReview,
  onSuccess,
  onCancel,
}: OrderReviewFormProps) {
  const [currentTab, setCurrentTab] = useState("order");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Use custom hook for form state management
  const { form, onSubmit, isSubmitting, submitError, hasRider } = useReviewForm({
    order,
    existingReview,
    onSuccess,
  });

  // Tab configuration
  const tabs = [
    { value: "order", label: "Order" },
    ...(hasRider ? [{ value: "rider", label: "Delivery" }] : []),
    { value: "items", label: "Items" },
  ];

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full h-10 sm:h-11 p-0.5 sm:p-1 bg-muted/60" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className={cn(
                  "transition-colors duration-200 flex-shrink-0",
                  currentTab === tab.value ? "text-primary" : "text-muted-foreground"
                )}>
                  {tabIcons[tab.value]}
                </span>
                <span className="truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Order Review Section */}
          <TabsContent value="order" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div
              className={cn(
                "transition-all",
                prefersReducedMotion ? "" : "duration-300",
                currentTab === "order" && isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              )}
            >
              <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Overall Experience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <FormField
                    control={form.control}
                    name="orderRating"
                    render={({ field }) => (
                      <FormItem className="space-y-2 sm:space-y-3">
                        <FormLabel className="text-sm sm:text-base font-medium">Rate Your Order</FormLabel>
                        <FormControl>
                          <div className="py-1 sm:py-2">
                            <Rating
                              value={field.value || 0}
                              onChange={(val) => field.onChange(Math.round(val))}
                              interactive
                              size="lg"
                              showValue
                              precision="full"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm text-muted-foreground/80">
                          How would you rate your overall order experience?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderMessage"
                    render={({ field }) => (
                      <FormItem className="space-y-2 sm:space-y-3">
                        <FormLabel className="text-sm sm:text-base font-medium">Your Review (Optional)</FormLabel>
                        <FormControl>
                          <TextArea
                            placeholder="Share your experience with this order..."
                            className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base transition-all duration-200 focus:shadow-sm"
                            maxLength={500}
                            showCharCount
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rider Review Section */}
          {hasRider && (
            <TabsContent value="rider" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <div
                className={cn(
                  "transition-all",
                  prefersReducedMotion ? "" : "duration-300",
                  currentTab === "rider" && isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                )}
              >
                {/* Rider Info Display */}
                <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-border/50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm truncate">{order.rider.info.name}</p>
                        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                          <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground flex-shrink-0" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {order.rider.info.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Card */}
                <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 mt-3 sm:mt-4">
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">Delivery Experience</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
                    <FormField
                      control={form.control}
                      name="riderRating"
                      render={({ field }) => (
                        <FormItem className="space-y-2 sm:space-y-3">
                          <FormLabel className="text-sm sm:text-base font-medium">Rate Delivery Service</FormLabel>
                          <FormControl>
                            <div className="py-1 sm:py-2">
                              <Rating
                                value={field.value || 0}
                                onChange={(val) => field.onChange(Math.round(val))}
                                interactive
                                size="lg"
                                showValue
                                precision="full"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs sm:text-sm text-muted-foreground/80">
                            How was your delivery experience?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="riderMessage"
                      render={({ field }) => (
                        <FormItem className="space-y-2 sm:space-y-3">
                          <FormLabel className="text-sm sm:text-base font-medium">Delivery Feedback (Optional)</FormLabel>
                          <FormControl>
                            <TextArea
                              placeholder="Share feedback about the delivery service..."
                              className="resize-none min-h-[80px] sm:min-h-[100px] text-sm sm:text-base transition-all duration-200 focus:shadow-sm"
                              maxLength={500}
                              showCharCount
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Items Review Section */}
          <TabsContent value="items" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div
              className={cn(
                "transition-all",
                prefersReducedMotion ? "" : "duration-300",
                currentTab === "items" && isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              )}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500/15 to-green-500/5 flex items-center justify-center">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">
                      Rate Items ({order.items.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-2 sm:space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 scrollbar-hide">
                    {order.items.map((item, index) => (
                      <div
                        key={item.itemId}
                        className={cn(
                          "transition-all duration-300",
                          currentTab === "items" && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                        )}
                        style={{ transitionDelay: currentTab === "items" && isVisible ? `${index * 50}ms` : "0ms" }}
                      >
                        <Card className="border-border/50 hover:border-border hover:shadow-sm transition-all duration-200 group">
                          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Item Header */}
                            <div className="flex gap-2 sm:gap-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-muted/50 flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-xs sm:text-sm truncate">
                                  {item.name}
                                </h4>
                                {item.variants && item.variants.length > 0 && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                    {item.variants.join(", ")}
                                  </p>
                                )}
                                {item.addons && item.addons.length > 0 && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                    + {item.addons.map((a) => a.name).join(", ")}
                                  </p>
                                )}
                                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5 sm:mt-1">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Rating Field */}
                            <FormField
                              control={form.control}
                              name={`items.${index}.rating`}
                              render={({ field }) => (
                                <FormItem className="space-y-1.5 sm:space-y-2">
                                  <FormControl>
                                    <Rating
                                      value={field.value || 0}
                                      onChange={(val) => field.onChange(Math.round(val))}
                                      interactive
                                      size="default"
                                      showValue
                                      precision="full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Message Field */}
                            <FormField
                              control={form.control}
                              name={`items.${index}.message`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <TextArea
                                      placeholder="Any specific feedback? (Optional)"
                                      className="resize-none min-h-[56px] sm:min-h-[60px] text-xs sm:text-sm transition-all duration-200 focus:shadow-sm"
                                      maxLength={300}
                                      showCharCount
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {submitError && (
          <div
            className={cn(
              "transition-all duration-200",
              submitError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            )}
          >
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Submission Failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border/40 transition-opacity duration-200 delay-200",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="min-w-full sm:min-w-[100px] min-h-[44px] sm:min-h-[40px] text-sm sm:text-base transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "min-w-full sm:min-w-[140px] min-h-[44px] sm:min-h-[40px] text-sm sm:text-base relative overflow-hidden transition-transform duration-150",
                !isSubmitting && "hover:scale-[1.02] active:scale-[0.98]"
              )}
              aria-live="polite"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Submitting...
                </span>
              ) : (
                <span>Submit Review</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
