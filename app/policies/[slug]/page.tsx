import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPolicies, fetchPolicyContent } from "@/lib/api/server-fetchers";
import { PolicyContent } from "@/components/policies/policy-content";

interface PolicyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all policies
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  try {
    const policies = await fetchPolicies();
    return policies.map((policy) => ({
      slug: policy.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for policies:", error);
    return [];
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await fetchPolicyContent(slug);

  if (!policy) {
    return {
      title: "Policy Not Found | Pizza Space",
      description: "The requested policy could not be found.",
    };
  }

  // Extract first 160 characters from content for description
  // Strip HTML tags for meta description
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const description = stripHtml(policy.content).substring(0, 160);

  return {
    title: `${policy.name} | Pizza Space`,
    description: description || `Read our ${policy.name.toLowerCase()} at Pizza Space.`,
    keywords: [
      policy.name.toLowerCase(),
      "pizza space policy",
      "pizza restaurant policy",
      "terms and conditions",
      "privacy policy",
      "customer policy",
    ],
    alternates: {
      canonical: `https://pizzaspace.co.uk/policies/${policy.slug}`,
    },
    openGraph: {
      title: `${policy.name} | Pizza Space`,
      description: description || `Read our ${policy.name.toLowerCase()} at Pizza Space.`,
      url: `https://pizzaspace.co.uk/policies/${policy.slug}`,
      siteName: "Pizza Space",
      type: "website",
      locale: "en_GB",
    },
    twitter: {
      card: "summary",
      title: `${policy.name} | Pizza Space`,
      description: description || `Read our ${policy.name.toLowerCase()} at Pizza Space.`,
    },
  };
}

/**
 * Policy Detail Page
 * Displays individual policy content with breadcrumbs and metadata
 */
export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await fetchPolicyContent(slug);

  // Show 404 if policy not found
  if (!policy) {
    notFound();
  }

  return (
    <PolicyContent
      name={policy.name}
      content={policy.content}
      updatedAt={policy.updatedAt}
    />
  );
}

/**
 * Enable static generation with revalidation
 * Revalidate every hour to pick up policy updates
 */
export const revalidate = 3600;
