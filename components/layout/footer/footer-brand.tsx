import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/pizzaspace",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/pizzaspace",
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/pizzaspace",
    icon: Twitter,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@pizzaspace",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];

export function FooterBrand() {
  return (
    <div className="lg:pr-8">
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-3 group mb-5">
        <div className="relative w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
          <span className="text-white font-bold text-xl">PS</span>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-xl tracking-tight">
            PizzaSpace
          </span>
          <span className="text-gray-400 text-xs">Craft Pizza Since 2020</span>
        </div>
      </Link>

      {/* Tagline */}
      <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
        Handcrafted pizzas made with love, fresh ingredients, and a passion for perfection. Experience the taste of authentic Italian craftsmanship.
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-3 mb-8">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
              className="
                group/icon relative w-10 h-10 rounded-full
                bg-navy-800 hover:bg-primary-500
                flex items-center justify-center
                transition-all duration-300
                hover:scale-110 hover:shadow-lg hover:shadow-primary-500/20
              "
            >
              <Icon className="w-5 h-5 text-gray-400 group-hover/icon:text-white transition-colors duration-300" />
            </Link>
          );
        })}
      </div>

      {/* App Store Badges */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="#"
          className="
            group inline-flex items-center gap-3
            bg-navy-800 hover:bg-navy-700
            rounded-xl px-4 py-2.5
            transition-all duration-300
            hover:scale-[1.02] hover:shadow-lg
          "
        >
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] leading-none">Download on the</span>
            <span className="text-white font-semibold text-sm">App Store</span>
          </div>
        </Link>

        <Link
          href="#"
          className="
            group inline-flex items-center gap-3
            bg-navy-800 hover:bg-navy-700
            rounded-xl px-4 py-2.5
            transition-all duration-300
            hover:scale-[1.02] hover:shadow-lg
          "
        >
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] leading-none">Get it on</span>
            <span className="text-white font-semibold text-sm">Google Play</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
