import { CategoryResponse, SubCategoryResponse } from "@/types";
import { CategoryAccordion } from "./category-accordion";

interface CategorySidebarProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
}

/**
 * CategorySidebar - Server Component
 *
 * Purpose: Structures category data and passes to accordion
 * - Groups subcategories by their parent category ID
 * - Applies active states based on URL params
 * - Passes structured data to CategoryAccordion client component
 */
export default function CategorySidebar({
  categories,
  subcategories,
  activeCategory,
  activeSubcategory,
}: CategorySidebarProps) {
  // Group subcategories by category ID for efficient lookup
  const subcategoriesByCategory = new Map<string, SubCategoryResponse[]>();

  subcategories.forEach((sub) => {
    const existing = subcategoriesByCategory.get(sub.categoryId) || [];
    subcategoriesByCategory.set(sub.categoryId, [...existing, sub]);
  });

  // Sort subcategories within each category by sortOrder
  subcategoriesByCategory.forEach((subs, categoryId) => {
    subcategoriesByCategory.set(
      categoryId,
      subs.sort((a, b) => a.sortOrder - b.sortOrder)
    );
  });

  // Sort categories by sortOrder
  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Categories</h2>
      <CategoryAccordion
        categories={sortedCategories}
        subcategoriesByCategory={subcategoriesByCategory}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
      />
    </div>
  );
}
