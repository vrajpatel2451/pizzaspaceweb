import Link from "next/link";
import Image from "next/image";
import { CategoryResponse } from "@/types";

interface CategoryCardProps {
  category: CategoryResponse;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/menu?category=${category._id}`}
      className="group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
            className="object-cover"
            priority={false}
          />
        </div>
        <p className="text-center mt-2 sm:mt-3 font-semibold uppercase text-xs sm:text-sm md:text-base text-gray-800 group-hover:text-orange-500 transition-colors">
          {category.name}
        </p>
      </div>
    </Link>
  );
}
