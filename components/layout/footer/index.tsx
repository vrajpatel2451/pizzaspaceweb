import { Suspense } from "react";
import { NewsletterSection } from "./newsletter-section";
import { FooterBrand } from "./footer-brand";
import { FooterLinksColumn, quickLinks, helpLinks } from "./footer-links";
import { FooterContact } from "./footer-contact";
import { FooterBottom } from "./footer-bottom";
import { fetchFooterData } from "@/lib/api/server-fetchers";

// Loading skeletons
function FooterBrandSkeleton() {
  return (
    <div className="lg:pr-8 animate-pulse">
      <div className="h-12 w-48 bg-navy-800 rounded-lg mb-5" />
      <div className="h-16 bg-navy-800 rounded-lg mb-6" />
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-10 bg-navy-800 rounded-full" />
        ))}
      </div>
    </div>
  );
}

function FooterContactSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-navy-800 rounded mb-5" />
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-9 w-9 bg-navy-800 rounded-lg" />
            <div className="flex-1">
              <div className="h-3 w-16 bg-navy-800 rounded mb-1" />
              <div className="h-4 w-40 bg-navy-800 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-32 bg-navy-800 rounded-xl" />
    </div>
  );
}

async function FooterContent() {
  const data = await fetchFooterData();

  return (
    <>
      {/* Column 1: Brand */}
      <div className="sm:col-span-2 lg:col-span-1">
        <FooterBrand
          footerLogo={data.footerLogo}
          socialMedia={data.socialMedia}
        />
      </div>

      {/* Column 2: Quick Links */}
      <div>
        <FooterLinksColumn title="Quick Links" links={quickLinks} />
      </div>

      {/* Column 3: Help & Support */}
      <div>
        <FooterLinksColumn
          title="Help & Support"
          links={helpLinks}
          policies={data.footerPolicies}
        />
      </div>

      {/* Column 4: Contact */}
      <div>
        <FooterContact
          contactInfo={data.contactInfo}
          openingHours={data.openingHours}
        />
      </div>

      {/* Bottom Bar - Pass policies for legal links */}
      <div className="sm:col-span-2 lg:col-span-4">
        <FooterBottom policies={data.footerPolicies} />
      </div>
    </>
  );
}

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
            <Suspense
              fallback={
                <>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <FooterBrandSkeleton />
                  </div>
                  <div className="col-span-1" />
                  <div className="col-span-1" />
                  <div className="sm:col-span-2 lg:col-span-1">
                    <FooterContactSkeleton />
                  </div>
                </>
              }
            >
              <FooterContent />
            </Suspense>
          </div>
        </div>

        {/* Decorative bottom gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
      </div>
    </footer>
  );
}
