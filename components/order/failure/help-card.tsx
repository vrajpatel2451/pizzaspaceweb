import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Mail, Phone } from "lucide-react";

interface HelpCardProps {
  supportEmail?: string;
  supportPhone?: string;
  className?: string;
}

/**
 * HelpCard - Support information card for failed order page
 * Server Component - Static support contact information
 * Light blue/gray background with help icon
 */
export function HelpCard({
  supportEmail = "support@pizzaspace.com",
  supportPhone = "+44-123-456-7890",
  className,
}: HelpCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/30 border-blue-200 dark:border-blue-800 ${className || ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Help Icon */}
          <div className="flex-shrink-0">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3">
              <HelpCircle
                className="size-6 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Support Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              Our support team is here to help you resolve this issue.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              {/* Email Contact */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Mail
                    className="size-5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    aria-label={`Send email to ${supportEmail}`}
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Phone
                    className="size-5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                    Phone
                  </p>
                  <a
                    href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    aria-label={`Call ${supportPhone}`}
                  >
                    {supportPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
