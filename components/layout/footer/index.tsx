import Link from "next/link";
import { FooterLinks } from "./footer-links";
import { FooterSocial } from "./footer-social";
import { FooterCopyright } from "./footer-copyright";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Stores", href: "/stores" },
  { label: "Menu", href: "/menu" },
  { label: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return Policy", href: "/returns" },
  { label: "Delivery Terms", href: "/delivery-terms" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1: Logo & Contact */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PS</span>
                </div>
                <span className="text-white font-bold text-xl">Pizza Space</span>
              </div>
            </Link>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="text-white font-semibold">Address:</span>
                <br />
                123 Pizza Street,
                <br />
                Food City, FC 12345
              </p>
              <p className="text-gray-400">
                <span className="text-white font-semibold">Phone:</span>
                <br />
                <a href="tel:+12345678900" className="hover:text-white transition-colors">
                  +1 234 567 8900
                </a>
              </p>
              <p className="text-gray-400">
                <span className="text-white font-semibold">Email:</span>
                <br />
                <a href="mailto:info@pizzaspace.com" className="hover:text-white transition-colors">
                  info@pizzaspace.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <FooterLinks title="Quick Links" links={quickLinks} />

          {/* Column 3: Legal */}
          <FooterLinks title="Legal" links={legalLinks} />

          {/* Column 4: Follow Us */}
          <FooterSocial />
        </div>

        {/* Copyright Bar */}
        <FooterCopyright />
      </div>
    </footer>
  );
}
