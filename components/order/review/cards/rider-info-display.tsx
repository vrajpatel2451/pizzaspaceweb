import { User, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StaffResponse } from "@/types/order";

interface RiderInfoDisplayProps {
  rider: StaffResponse;
  className?: string;
}

export function RiderInfoDisplay({ rider, className }: RiderInfoDisplayProps) {
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          <p className="font-semibold text-sm">{rider.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-500" />
          <p className="text-xs text-muted-foreground">{rider.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
