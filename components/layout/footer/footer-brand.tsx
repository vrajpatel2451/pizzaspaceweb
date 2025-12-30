import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { CustomImage } from "@/components/ui/custom-image";

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
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
          <CustomImage
            src="/logo.png"
            alt="Pizza Space Logo"
            width={48}
            height={48}
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
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
      <div className="flex items-center gap-3">
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
    </div>
  );
}
