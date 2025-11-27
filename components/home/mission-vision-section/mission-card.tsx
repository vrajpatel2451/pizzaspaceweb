import { LucideIcon } from 'lucide-react';

interface MissionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MissionCard({ icon: Icon, title, description }: MissionCardProps) {
  return (
    <div className="text-center">
      {/* Icon Circle */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4 sm:mb-6">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">{title}</h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
