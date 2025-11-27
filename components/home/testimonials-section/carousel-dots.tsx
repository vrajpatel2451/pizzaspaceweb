interface CarouselDotsProps {
  count: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function CarouselDots({ count, selectedIndex, onSelect }: CarouselDotsProps) {
  return (
    <div className="flex justify-center gap-2 mt-6" role="group" aria-label="Testimonial navigation">
      {[...Array(count)].map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i === selectedIndex ? 'bg-slate-800' : 'bg-gray-300'
          }`}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === selectedIndex ? "true" : "false"}
        />
      ))}
    </div>
  );
}
