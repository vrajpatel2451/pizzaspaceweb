import { TestimonialsCarousel } from './testimonials-carousel';

export function TestimonialsSection() {
  return (
    <section className="bg-amber-50 py-16" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
            Customer Reviews
          </span>
          <h2 id="testimonials-heading" className="text-3xl font-bold mt-4 text-slate-800">
            What Our Customers Say
          </h2>
        </div>
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
