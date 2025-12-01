import React from "react";
import { Home, Briefcase, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddressTypeBadgeProps {
  type: "home" | "work" | "other";
  label?: string;
  className?: string;
}

export function AddressTypeBadge({
  type,
  label,
  className,
}: AddressTypeBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case "home":
        return <Home className="size-3" />;
      case "work":
        return <Briefcase className="size-3" />;
      case "other":
        return <MapPin className="size-3" />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "home":
        return "default" as const;
      case "work":
        return "secondary" as const;
      case "other":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  const getLabel = () => {
    if (type === "other" && label) {
      return label;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Badge
      variant={getVariant()}
      size="sm"
      className={cn("gap-1", className)}
      aria-label={`Address type: ${getLabel()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </Badge>
  );
}
