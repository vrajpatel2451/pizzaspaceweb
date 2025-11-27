import { Target, Eye } from 'lucide-react';
import { MissionCard } from './mission-card';

export function MissionVisionSection() {
  return (
    <section className="bg-amber-50 py-16" aria-label="Mission and vision">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-4xl mx-auto">
          <MissionCard
            icon={Target}
            title="Our Mission"
            description="To bring authentic Italian flavors to every table, creating memorable dining experiences through exceptional food, warm hospitality, and community connection. We strive to be the heart of our neighborhood's culinary landscape."
          />
          <MissionCard
            icon={Eye}
            title="Our Vision"
            description="To become the most beloved pizza destination, known for our unwavering commitment to quality, innovation in traditional recipes, and creating a welcoming space where families and friends gather to share great food and create lasting memories."
          />
        </div>
      </div>
    </section>
  );
}
