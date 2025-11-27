import { LucideIcon } from 'lucide-react';

interface ContactMethod {
  id: number;
  icon: LucideIcon;
  title: string;
  primary: string;
  secondary: string;
}

interface ContactCardProps {
  method: ContactMethod;
}

export function ContactCard({ method }: ContactCardProps) {
  const { icon: Icon, title, primary, secondary } = method;

  return (
    <div className="text-center">
      {/* Icon Circle */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm sm:text-base text-slate-800 mb-2">{title}</h3>

      {/* Primary Info */}
      <p className="text-sm sm:text-base text-slate-700">{primary}</p>

      {/* Secondary Info */}
      <p className="text-gray-500 text-xs sm:text-sm">{secondary}</p>
    </div>
  );
}
