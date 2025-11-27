import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: Youtube,
  },
];

export function FooterSocial() {
  return (
    <div>
      <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
      <div className="flex gap-4 mb-3">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={social.name}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
      <p className="text-gray-400 text-sm">
        Stay updated with our latest offers and news!
      </p>
    </div>
  );
}
