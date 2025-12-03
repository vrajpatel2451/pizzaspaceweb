import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { StoreProvider } from "@/lib/contexts/store-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  RestaurantJsonLd,
  LocalBusinessJsonLd,
  WebsiteJsonLd,
  OrganizationJsonLd,
} from "@/components/seo/json-ld";
import "./globals.css";
import { Toaster } from "@/components/ui";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pizza Space | Authentic Italian Pizza in London",
    template: "%s | Pizza Space",
  },
  description:
    "Order delicious handcrafted pizzas from Pizza Space. Fresh ingredients, fast delivery across London. Experience authentic Italian flavors with our premium selection of pizzas, sides, and desserts.",
  keywords: [
    "pizza",
    "pizza delivery",
    "pizza delivery London",
    "Italian pizza",
    "authentic pizza",
    "pizza takeaway",
    "pizza restaurant",
    "food delivery",
    "pizza near me",
    "best pizza London",
    "fresh pizza",
    "handcrafted pizza",
    "Pizza Space",
  ],
  authors: [{ name: "Pizza Space" }],
  creator: "Pizza Space",
  publisher: "Pizza Space",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://pizzaspace.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://pizzaspace.co.uk",
    siteName: "Pizza Space",
    title: "Pizza Space | Authentic Italian Pizza in London",
    description:
      "Order delicious handcrafted pizzas from Pizza Space. Fresh ingredients, fast delivery across London. Experience authentic Italian flavors.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pizza Space - Authentic Italian Pizza delivered fresh to your door",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizza Space | Authentic Italian Pizza in London",
    description:
      "Order delicious handcrafted pizzas from Pizza Space. Fresh ingredients, fast delivery across London.",
    images: ["/og-image.jpg"],
    creator: "@pizzaspace",
    site: "@pizzaspace",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#F97316",
      },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "Pizza Space",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pizza Space",
  },
  verification: {
    google: "your-google-site-verification-code",
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <RestaurantJsonLd />
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />

        <OrganizationJsonLd />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <NextTopLoader
          color="#F97316"
          height={3}
          showSpinner={false}
          crawl={true}
          crawlSpeed={200}
          speed={200}
          shadow="0 0 10px #F97316,0 0 5px #F97316"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <StoreProvider>
            <CartProvider>
              <AuthProvider>
                <Header />
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </AuthProvider>
            </CartProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
