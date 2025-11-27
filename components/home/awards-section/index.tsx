import { AwardCard } from './award-card';

const awards = [
  {
    id: 1,
    title: "Best Pizza 2023",
    source: "Food & Wine Magazine"
  },
  {
    id: 2,
    title: "Customer Choice",
    source: "Local Business Awards"
  },
  {
    id: 3,
    title: "Quality Excellence",
    source: "Restaurant Association"
  },
  {
    id: 4,
    title: "5-Star Rating",
    source: "Food Delivery Apps"
  }
];

export function AwardsSection() {
  return (
    <section className="bg-amber-50 py-16" aria-labelledby="awards-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
            Recognition
          </span>
          <h2 id="awards-heading" className="text-3xl font-bold mt-4 text-slate-800">
            Awards & Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {awards.map(award => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      </div>
    </section>
  );
}
