import Link from "next/link";
import { Home, FileX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPolicies } from "@/lib/api/server-fetchers";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

/**
 * Not Found page for policies
 * Shows when a policy slug doesn't exist
 */
export default async function PolicyNotFound() {
  // Fetch available policies to show alternatives
  const policies = await fetchPolicies();

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/#footer-policies">Policies</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Not Found Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-orange-100 dark:bg-orange-500/10 p-6">
              <FileX className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Policy Not Found
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, we could not find the policy you are looking for. It may have been moved or deleted.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#footer-policies">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Policies
              </Link>
            </Button>
          </div>

          {/* Available Policies */}
          {policies.length > 0 && (
            <Card className="text-left">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Available Policies</h2>
                <div className="space-y-2">
                  {policies.map((policy) => (
                    <Link
                      key={policy._id}
                      href={`/policies/${policy.slug}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="font-medium text-foreground">
                        {policy.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date(policy.updatedAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
