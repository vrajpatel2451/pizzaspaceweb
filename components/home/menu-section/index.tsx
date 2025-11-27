import { getProducts, getCategories } from "@/lib/api";
import { getMockProducts } from "@/lib/mocks/products";
import { getMockCategories } from "@/lib/mocks/categories";
import { MenuContent } from "./menu-content";

export async function MenuSection() {
  let products;
  let categories;
  let meta;

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts({ limit: 8, page: 1 }),
      getCategories({ limit: 10 }),
    ]);
    products = productsRes.data.data;
    categories = categoriesRes.data.data;
    meta = productsRes.data.meta;
  } catch (error) {
    // Fallback to mock data if API fails
    console.error("Failed to fetch menu data, using mock data:", error);
    const mockProducts = getMockProducts(1, 8);
    const mockCategories = getMockCategories(1, 10);
    products = mockProducts.data.data;
    categories = mockCategories.data.data;
    meta = mockProducts.data.meta;
  }

  return (
    <section className="bg-white py-16" aria-labelledby="menu-heading">
      <div className="container mx-auto px-4">
        <h2 id="menu-heading" className="text-3xl font-bold text-center uppercase mb-8 text-slate-900">
          OUR SPECIAL MENU
        </h2>
        <MenuContent
          initialProducts={products}
          categories={categories}
          initialMeta={meta}
        />
      </div>
    </section>
  );
}
