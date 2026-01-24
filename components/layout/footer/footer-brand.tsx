import Link from "next/link";
import { CustomImage } from "@/components/ui/custom-image";
import type { SocialMedia } from "@/types";

interface FooterBrandProps {
  footerLogo: string | null;
  socialMedia: SocialMedia[];
}

// Fallback logo
const fallbackLogo = "/logo.png";

export function FooterBrand({ footerLogo, socialMedia }: FooterBrandProps) {
  const logoSrc = footerLogo || fallbackLogo;

  return (
    <div className="lg:pr-8">
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-3 group mb-5">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
          <CustomImage
            src={logoSrc}
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
        Handcrafted pizzas made with love, fresh ingredients, and a passion for
        perfection. Experience the taste of authentic Italian craftsmanship.
      </p>

      {/* Social Icons */}
      {socialMedia.length > 0 && (
        <div className="flex items-center gap-3">
          {socialMedia.map((social) => (
            <Link
              key={social._id}
              href={social.link}
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
              <CustomImage
                src={social.logo}
                alt={`${social.name} icon`}
                width={20}
                height={20}
                className="w-5 h-5 text-gray-400 group-hover/icon:text-white transition-colors duration-300 object-contain"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
