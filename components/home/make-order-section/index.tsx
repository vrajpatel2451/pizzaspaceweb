import Link from "next/link";
import { Pizza, ArrowRight } from "lucide-react";

/**
 * MakeOrderSection Component
 *
 * A call-to-action section encouraging users to browse the menu and place orders.
 * Features a centered layout with title, description, and prominent CTA button.
 */
export function MakeOrderSection() {
  return (
    <section className="bg-amber-50 py-20" aria-labelledby="make-order-heading">
      <div className="container mx-auto px-4 text-center">
        <h2
          id="make-order-heading"
          className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
        >
          Make Your Order
        </h2>

        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-8">
          Choose from our delicious menu and get your favorite pizza delivered
          hot and fresh to your doorstep.
        </p>

        <Link
          href="/menu"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg gap-2"
        >
          <Pizza className="h-5 w-5" aria-hidden="true" />
          Browse Menu
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
