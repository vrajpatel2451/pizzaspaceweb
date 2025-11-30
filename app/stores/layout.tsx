import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Stores | Pizza Space",
  description:
    "Find your nearest Pizza Space location. Browse all our stores across the UK, reserve a table, and enjoy fresh pizza with exceptional service.",
  keywords: [
    "pizza locations",
    "pizza stores",
    "pizza restaurants near me",
    "Pizza Space locations",
    "reserve table",
  ],
};

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
