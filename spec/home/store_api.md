## Store API

    ```code
    [GET] /store
        Request params: StoreQueryParams
        Response: APIResponse<PaginatedResponse<StoreResponse>>
    ```

See @spec/home/base_api.md

**_Store Types_**

```tsx
export interface StoreQueryParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
  search?: string;
  isActive?: boolean;
}
export type StoreResponse = {
  _id: string;
  name: string;
  imageUrl: string;
  // contact
  phone: string;
  email: string;
  // address
  deliveryRadius: number; // in miles
  lat: number;
  long: number;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  isActive: boolean;
  createdAt: string;
};
```
