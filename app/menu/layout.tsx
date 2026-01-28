import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu - Pizza Space",
  description:
    "Browse our complete menu of authentic Italian pizzas, sides, drinks, and desserts. Fresh ingredients, handcrafted with love, delivered to your door.",
  keywords: [
    "pizza menu",
    "Italian pizza",
    "pizza delivery",
    "pizza takeaway",
    "pizza collection",
    "London pizza",
    "pizza space menu",
    "gourmet pizza",
    "classic pizza",
    "vegan pizza",
  ],
  openGraph: {
    title: "Menu - Pizza Space",
    description:
      "Explore our delicious menu of handcrafted pizzas and Italian specialties",
    url: "https://pizzaspace.co.uk/menu",
    siteName: "Pizza Space",
    images: [
      {
        url: "https://pizzaspace.co.uk/og-menu.jpg",
        width: 1200,
        height: 630,
        alt: "Pizza Space Menu",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu - Pizza Space",
    description:
      "Explore our delicious menu of handcrafted pizzas and Italian specialties",
    images: ["https://pizzaspace.co.uk/og-menu.jpg"],
  },
  alternates: {
    canonical: "https://pizzaspace.co.uk/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
