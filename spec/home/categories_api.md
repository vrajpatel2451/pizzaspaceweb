## Categories API

    ```code
    [GET] /categories
        Request params: CategoryQueryParams
        Response: APIResponse<PaginatedResponse<CategoryResponse>>
    ```

See @spec/home/base_api.md

**_Categories Types_**

```tsx
interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  all?: boolean;
  categoryId?: string;
}

interface CategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  storeIds: string[];
}
```
