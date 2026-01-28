// Example: Product Card with Availability Badge
// This demonstrates how to integrate the AvailabilityBadge component

import { AvailabilityBadge } from "@/components/product";
import { ProductResponse } from "@/types/product";
import { OrderDeliveryType } from "@/types/cart";
import { CustomImage } from "@/components/ui/custom-image";

interface ProductCardProps {
  product: ProductResponse;
  deliveryType: OrderDeliveryType;
  onAddToCart?: () => void;
}

export function ProductCard({
  product,
  deliveryType,
  onAddToCart,
}: ProductCardProps) {
  // Check if product is available for selected delivery type
  const isAvailable = product.availableDeliveryTypes.includes(deliveryType);

  return (
    <div className="relative rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image with Availability Badge Overlay */}
      <div className="relative aspect-video">
        <AvailabilityBadge
          available={isAvailable}
          deliveryType={deliveryType}
        />
        <CustomImage
          src={product.photoList[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            ${product.basePrice.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            disabled={!isAvailable}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isAvailable
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Example: Menu Grid with Delivery Type Selector
interface MenuGridProps {
  products: ProductResponse[];
  selectedDeliveryType: OrderDeliveryType;
  onDeliveryTypeChange: (type: OrderDeliveryType) => void;
}

export function MenuGrid({
  products,
  selectedDeliveryType,
  onDeliveryTypeChange,
}: MenuGridProps) {
  const deliveryTypes: OrderDeliveryType[] = ["delivery", "pickup", "dineIn"];

  const deliveryTypeLabels: Record<OrderDeliveryType, string> = {
    delivery: "Delivery",
    pickup: "Collection",
    dineIn: "Dine In",
  };

  return (
    <div>
      {/* Delivery Type Selector */}
      <div className="flex gap-2 mb-6">
        {deliveryTypes.map((type) => (
          <button
            key={type}
            onClick={() => onDeliveryTypeChange(type)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedDeliveryType === type
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {deliveryTypeLabels[type]}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            deliveryType={selectedDeliveryType}
            onAddToCart={() => console.log("Add to cart:", product._id)}
          />
        ))}
      </div>
    </div>
  );
}

// Example: Filtering Products by Availability
export function useAvailableProducts(
  products: ProductResponse[],
  deliveryType: OrderDeliveryType,
  showUnavailable: boolean = true,
) {
  if (showUnavailable) {
    // Show all products with badges
    return products.map((product) => ({
      ...product,
      isAvailable: product.availableDeliveryTypes.includes(deliveryType),
    }));
  }

  // Filter to show only available products
  return products
    .filter((product) => product.availableDeliveryTypes.includes(deliveryType))
    .map((product) => ({
      ...product,
      isAvailable: true,
    }));
}
