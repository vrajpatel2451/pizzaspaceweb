import { ProductResponse } from "@/types";

interface MenuJsonLdProps {
  products: ProductResponse[];
  currentCategory?: string;
  currentSubcategory?: string;
}

/**
 * Menu Page JSON-LD Structured Data
 * Provides ItemList schema for products to enhance SEO
 * Helps search engines understand the menu structure and product offerings
 */
export function MenuJsonLd({
  products,
  currentCategory,
  currentSubcategory,
}: MenuJsonLdProps) {
  // Build ItemList schema for products
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: currentCategory
      ? "Pizza Space Menu - Filtered Products"
      : "Pizza Space Complete Menu",
    description: currentCategory
      ? `Browse our ${currentCategory} selection`
      : "Browse our complete menu of authentic Italian pizzas and specialties",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `https://pizzaspace.co.uk/menu/${product._id}`,
        name: product.name,
        description: product.description,
        image: product.photoList[0] || "https://pizzaspace.co.uk/placeholder-pizza.jpg",
        offers: {
          "@type": "Offer",
          price: product.basePrice.toFixed(2),
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: `https://pizzaspace.co.uk/menu/${product._id}`,
        },
        ...(product.type && {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Product Type",
            value: product.type === "veg" ? "Vegetarian" : product.type === "vegan" ? "Vegan" : "Non-Vegetarian",
          },
        }),
      },
    })),
  };

  // BreadcrumbList for navigation hierarchy
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pizzaspace.co.uk",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menu",
        item: "https://pizzaspace.co.uk/menu",
      },
      ...(currentCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: currentCategory,
              item: `https://pizzaspace.co.uk/menu?category=${currentCategory}`,
            },
          ]
        : []),
      ...(currentSubcategory
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: currentSubcategory,
              item: `https://pizzaspace.co.uk/menu?category=${currentCategory}&subcategory=${currentSubcategory}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
    </>
  );
}
