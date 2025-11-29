import { NewsletterSection } from "./newsletter-section";
import { FooterBrand } from "./footer-brand";
import { FooterLinksColumn, quickLinks, helpLinks } from "./footer-links";
import { FooterContact } from "./footer-contact";
import { FooterBottom } from "./footer-bottom";

export function Footer() {
  return (
    <footer className="relative">
      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Main Footer */}
      <div className="bg-navy-900">
        {/* Decorative top border - orange gradient accent */}
        <div className="h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400" />

        <div className="container mx-auto px-4 py-12 lg:py-16">
          {/* Main Grid - 4 Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <FooterBrand />
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <FooterLinksColumn title="Quick Links" links={quickLinks} />
            </div>

            {/* Column 3: Help & Support */}
            <div>
              <FooterLinksColumn title="Help & Support" links={helpLinks} />
            </div>

            {/* Column 4: Contact */}
            <div>
              <FooterContact />
            </div>
          </div>

          {/* Bottom Bar */}
          <FooterBottom />
        </div>

        {/* Decorative bottom gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
      </div>
    </footer>
  );
}
