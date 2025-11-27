import Image from "next/image";
import { ProductResponse } from "@/types";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.photoList[0] || "/placeholder.jpg";

  return (
    <div className="text-center p-3 sm:p-4 hover:shadow-lg rounded-lg transition-shadow duration-300">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden bg-slate-800">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
          loading="lazy"
        />
      </div>
      <h3 className="font-semibold mt-3 sm:mt-4 text-sm sm:text-base text-slate-900">{product.name}</h3>
      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1 min-h-[36px] sm:min-h-[40px]">
        {product.description}
      </p>
      <p className="text-orange-500 font-bold text-base sm:text-lg mt-2">
        ${product.basePrice.toFixed(2)}
      </p>
    </div>
  );
}
