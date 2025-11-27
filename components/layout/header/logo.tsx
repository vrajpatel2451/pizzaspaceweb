import Link from "next/link";
import { Pizza } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group transition-transform hover:scale-105"
      aria-label="Pizza Space Home"
    >
      <div className="relative flex items-center justify-center size-10 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors">
        <Pizza className="size-6 text-white" />
      </div>
      <span className="text-xl font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
        Pizza Space
      </span>
    </Link>
  );
}
