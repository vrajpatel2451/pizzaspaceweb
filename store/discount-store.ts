import { create } from 'zustand';
import { DiscountResponse } from '@/types/discount';

interface DiscountState {
  availableDiscounts: DiscountResponse[];
  isModalOpen: boolean;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

interface DiscountActions {
  setDiscounts: (discounts: DiscountResponse[]) => void;
  openModal: () => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

type DiscountStore = DiscountState & DiscountActions;

const initialState: DiscountState = {
  availableDiscounts: [],
  isModalOpen: false,
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const useDiscountStore = create<DiscountStore>()((set) => ({
  ...initialState,

  setDiscounts: (discounts) => set({ availableDiscounts: discounts }),

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({ isModalOpen: false, searchQuery: '' }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

// Selector hooks for optimized re-renders
export const useAvailableDiscounts = () => useDiscountStore((state) => state.availableDiscounts);
export const useIsDiscountModalOpen = () => useDiscountStore((state) => state.isModalOpen);
export const useDiscountSearchQuery = () => useDiscountStore((state) => state.searchQuery);
export const useIsDiscountLoading = () => useDiscountStore((state) => state.isLoading);
export const useDiscountError = () => useDiscountStore((state) => state.error);
