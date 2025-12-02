import { User, Mail, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StaffResponse } from "@/types/order";
import { cn } from "@/lib/utils";

interface DeliveryRiderDetailsProps {
  rider: StaffResponse;
  defaultOpen?: boolean;
  className?: string;
}

export function DeliveryRiderDetails({
  rider,
  defaultOpen = true,
  className,
}: DeliveryRiderDetailsProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <Collapsible defaultOpen={defaultOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity [&[data-state=open]>svg]:rotate-180">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-orange-500" />
              <span>Delivery Rider Details</span>
            </CardTitle>
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Rider Name */}
            <div>
              <p className="text-base font-semibold text-foreground">
                {rider.name}
              </p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <a
                href={`mailto:${rider.email}`}
                className="text-sm text-foreground hover:text-orange-500 transition-colors break-all"
              >
                {rider.email}
              </a>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
