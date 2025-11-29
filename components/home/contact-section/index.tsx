import { ContactInfo } from './contact-info';
import { ContactForm } from './contact-form';

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a question or want to place an order? We&apos;re here to help you 24/7
          </p>
        </div>

        {/* Contact Grid - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Contact Info & Map */}
          <div className="order-2 lg:order-1">
            <ContactInfo />
          </div>

          {/* Right Column - Contact Form */}
          <div className="order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-orange-50 dark:bg-orange-500/10 px-6 py-4 rounded-full border border-orange-200 dark:border-orange-500/20">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Need immediate assistance?
            </p>
            <div className="flex items-center gap-4">
              <a
                href="tel:+15551234567"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Call: +1 (555) 123-4567
              </a>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <a
                href="mailto:hello@pizzaspace.com"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
