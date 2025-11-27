import { AboutImage } from './about-image';
import { AboutContent } from './about-content';

export function AboutSection() {
  return (
    <section className="bg-white py-16" aria-labelledby="about-heading">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AboutImage />
          <AboutContent />
        </div>
      </div>
    </section>
  );
}
