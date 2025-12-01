/**
 * Cart and Checkout Hooks
 *
 * API integration layer for cart, address, and discount management.
 * These hooks provide data fetching, mutations, and state synchronization
 * with Zustand stores.
 */

// Cart hooks
export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useCartSummary,
} from './use-cart';

// Address hooks
export {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from './use-address';

// Discount hooks
export {
  useAvailableDiscounts,
  useSearchDiscounts,
  useApplyDiscount,
  useRemoveDiscount,
} from './use-discount';
