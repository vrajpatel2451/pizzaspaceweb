import { HighlightCard } from './highlight-card';
import { ChefHat, Award } from 'lucide-react';

export function AboutContent() {
  return (
    <div>
      {/* Badge */}
      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm inline-block">
        About Pizza Space
      </span>

      {/* Title */}
      <h2 id="about-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mt-4 mb-4 sm:mb-6">
        Crafting Perfect Pizzas Since 1998
      </h2>

      {/* Paragraphs */}
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        Founded by passionate Italian immigrants, Pizza Space has been the cornerstone of authentic pizza in our community. We combine traditional recipes with modern techniques to create unforgettable dining experiences.
      </p>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Our commitment to quality ingredients, artisanal preparation, and exceptional service has made us the preferred choice for pizza lovers across the city.
      </p>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        <HighlightCard
          icon={ChefHat}
          title="Master Chefs"
          description="Trained in authentic Italian techniques"
        />
        <HighlightCard
          icon={Award}
          title="Premium Quality"
          description="Only the finest ingredients used"
        />
      </div>
    </div>
  );
}
