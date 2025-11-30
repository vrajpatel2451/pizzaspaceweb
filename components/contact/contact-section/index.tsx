import { ContactInfo } from "./contact-info";
import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section
      className="relative w-full py-10 sm:py-12 md:py-16 lg:py-20"
      aria-labelledby="contact-section-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Right Column - Contact Form (first on mobile) */}
          <div className="order-1 lg:order-2">
            <ContactForm />
          </div>

          {/* Left Column - Contact Info (second on mobile) */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <h2 id="contact-section-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                Contact Information
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Get in touch with us through any of these channels
              </p>
            </div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
