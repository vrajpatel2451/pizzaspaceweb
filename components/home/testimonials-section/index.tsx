import { fetchTestimonials } from "@/lib/api/server-fetchers";
import { TestimonialsSectionClient } from "./testimonials-section-client";

export async function TestimonialsSection() {
  // Fetch testimonials from API
  const { testimonials, pagination } = await fetchTestimonials(1, 6);

  return (
    <TestimonialsSectionClient
      testimonials={testimonials}
      totalReviews={pagination.total}
    />
  );
}
