## Base API doc

**_ BASE URL should be in env only for now use this dummy url in env https://api.pizzaspace.co.uk/api/v1 _**

make axios interceptor with proper type casts which should always return `APIResponse<T>`

where base types are:

```tsx
export interface APIResponse<T> {
  statusCode: number;
  data: T;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

for paginated response you will get `APIResponse<PaginatedResponse<T>>`
