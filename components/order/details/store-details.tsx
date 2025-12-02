import { MapPin, Phone, Mail, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StoreResponse } from "@/types/store";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface StoreDetailsProps {
  store: StoreResponse;
  defaultOpen?: boolean;
  className?: string;
}

export function StoreDetails({
  store,
  defaultOpen = true,
  className,
}: StoreDetailsProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <Collapsible defaultOpen={defaultOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity [&[data-state=open]>svg]:rotate-180">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Store className="w-5 h-5 text-orange-500" />
              <span>Store Details</span>
            </CardTitle>
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Store Name */}
            <div>
              <p className="text-base font-semibold text-foreground">
                {store.name}
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <a
                href={`tel:${store.phone}`}
                className="text-sm text-foreground hover:text-orange-500 transition-colors"
              >
                {store.phone}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <a
                href={`mailto:${store.email}`}
                className="text-sm text-foreground hover:text-orange-500 transition-colors break-all"
              >
                {store.email}
              </a>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">
                {store.line1}
                {store.line2 && `, ${store.line2}`}
                <br />
                {store.area && `${store.area}, `}
                {store.city}, {store.county} {store.zip}
                {store.country && (
                  <>
                    <br />
                    {store.country}
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
