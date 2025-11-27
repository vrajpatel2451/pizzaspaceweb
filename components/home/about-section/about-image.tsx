import Image from 'next/image';

export function AboutImage() {
  return (
    <div className="relative">
      <div className="bg-slate-900 rounded-2xl p-8 aspect-square flex items-center justify-center">
        {/* Pizza Logo/Image */}
        <div className="relative w-full h-full max-w-[300px]">
          <Image
            src="/images/pizza-logo.png"
            alt="Pizza Space Logo"
            fill
            className="object-contain"
            loading="lazy"
            sizes="(max-width: 768px) 300px, 400px"
          />
        </div>
      </div>

      {/* Years Badge */}
      <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-0 bg-orange-500 text-white rounded-xl p-4 text-center shadow-lg">
        <span className="text-3xl font-bold block">25+</span>
        <span className="text-sm">Years Serving</span>
      </div>
    </div>
  );
}
