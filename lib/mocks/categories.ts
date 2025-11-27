import {
  APIResponse,
  PaginatedResponse,
  CategoryResponse,
} from "@/types";

export const mockCategories: CategoryResponse[] = [
  {
    _id: "cat_001",
    name: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001", "store_002"],
  },
  {
    _id: "cat_002",
    name: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001"],
  },
  {
    _id: "cat_003",
    name: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    sortOrder: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001", "store_002"],
  },
  {
    _id: "cat_004",
    name: "Sides",
    imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5",
    sortOrder: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001"],
  },
  {
    _id: "cat_005",
    name: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    sortOrder: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001", "store_002"],
  },
  {
    _id: "cat_006",
    name: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1437418747212-8d9709afab22",
    sortOrder: 6,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    storeIds: ["store_001", "store_002"],
  },
];

export function getMockCategories(
  page: number = 1,
  limit: number = 10
): APIResponse<PaginatedResponse<CategoryResponse>> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockCategories.slice(startIndex, endIndex);

  return {
    statusCode: 200,
    data: {
      data: paginatedData,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(mockCategories.length / limit),
        totalItems: mockCategories.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < mockCategories.length,
        hasPrevPage: page > 1,
      },
    },
  };
}
