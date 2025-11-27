import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  location: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center mx-2 sm:mx-4">
      {/* Quote Icon */}
      <div className="text-orange-500 mb-3 sm:mb-4">
        <Quote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto fill-current" />
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-1 mb-3 sm:mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Quote Text */}
      <p className="text-gray-700 italic text-base sm:text-lg mb-4 sm:mb-6">
        &quot;{testimonial.quote}&quot;
      </p>

      {/* Customer Info */}
      <p className="font-semibold text-sm sm:text-base text-slate-800">{testimonial.name}</p>
      <p className="text-gray-500 text-xs sm:text-sm">{testimonial.location}</p>
    </div>
  );
}
