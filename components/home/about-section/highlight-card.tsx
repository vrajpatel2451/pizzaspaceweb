import { LucideIcon } from 'lucide-react';

interface HighlightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function HighlightCard({ icon: Icon, title, description }: HighlightCardProps) {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-sm sm:text-base text-slate-800">{title}</h4>
        <p className="text-gray-500 text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  );
}
