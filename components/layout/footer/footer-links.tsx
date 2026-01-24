import Link from "next/link";
import type { PolicyListItem } from "@/types";

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
  policies?: PolicyListItem[];
}

export function FooterLinksColumn({
  title,
  links,
  policies = [],
}: FooterLinksColumnProps) {
  // Convert policies to FooterLink format
  const policyLinks: FooterLink[] = policies.map((policy) => ({
    label: policy.name,
    href: `/policies/${policy.slug}`,
  }));

  // Combine static links with policy links
  const allLinks = [...links, ...policyLinks];

  return (
    <div>
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
        {title}
      </h3>
      <ul className="space-y-3">
        {allLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="
                group inline-flex items-center gap-2
                text-gray-400 hover:text-white
                text-sm transition-colors duration-200
              "
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary-500 group-hover:w-full transition-all duration-300" />
              </span>
              {link.badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500 text-white animate-pulse">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const quickLinks: FooterLink[] = [
  { label: "Our Menu", href: "/menu" },
  { label: "Locations", href: "/stores" },
  { label: "About Us", href: "/about" },
];

export const helpLinks: FooterLink[] = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/order" },
];

// Combined component for simpler usage
export function FooterLinks() {
  return (
    <>
      <FooterLinksColumn title="Quick Links" links={quickLinks} />
      <FooterLinksColumn title="Help & Support" links={helpLinks} />
    </>
  );
}
