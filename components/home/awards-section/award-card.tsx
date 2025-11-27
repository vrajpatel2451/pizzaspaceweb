import { Trophy } from 'lucide-react';

interface Award {
  id: number;
  title: string;
  source: string;
}

interface AwardCardProps {
  award: Award;
}

export function AwardCard({ award }: AwardCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-3 sm:mb-4">
        <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
      </div>
      <h3 className="font-semibold text-sm sm:text-base text-slate-800 mb-1">{award.title}</h3>
      <p className="text-gray-500 text-xs sm:text-sm">{award.source}</p>
    </div>
  );
}
