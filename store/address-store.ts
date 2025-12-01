import { create } from 'zustand';
import { AddressResponse } from '@/types/address';

interface AddressState {
  addresses: AddressResponse[];
  selectedAddress: AddressResponse | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AddressActions {
  setAddresses: (addresses: AddressResponse[]) => void;
  addAddress: (address: AddressResponse) => void;
  updateAddress: (addressId: string, updates: Partial<AddressResponse>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (address: AddressResponse) => void;
  closeEditModal: () => void;
  openDeleteDialog: (address: AddressResponse) => void;
  closeDeleteDialog: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getDefaultAddress: () => AddressResponse | null;
  getAddressById: (addressId: string) => AddressResponse | null;
}

type AddressStore = AddressState & AddressActions;

const initialState: AddressState = {
  addresses: [],
  selectedAddress: null,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteDialogOpen: false,
  isLoading: false,
  error: null,
};

export const useAddressStore = create<AddressStore>()((set, get) => ({
  ...initialState,

  setAddresses: (addresses) => set({ addresses }),

  addAddress: (address) => set((state) => ({
    addresses: [...state.addresses, address],
  })),

  updateAddress: (addressId, updates) => set((state) => ({
    addresses: state.addresses.map((addr) =>
      addr._id === addressId ? { ...addr, ...updates } : addr
    ),
    selectedAddress:
      state.selectedAddress?._id === addressId
        ? { ...state.selectedAddress, ...updates }
        : state.selectedAddress,
  })),

  removeAddress: (addressId) => set((state) => ({
    addresses: state.addresses.filter((addr) => addr._id !== addressId),
    selectedAddress:
      state.selectedAddress?._id === addressId ? null : state.selectedAddress,
  })),

  setDefaultAddress: (addressId) => set((state) => ({
    addresses: state.addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === addressId,
    })),
  })),

  openAddModal: () => set({ isAddModalOpen: true, selectedAddress: null }),

  closeAddModal: () => set({ isAddModalOpen: false }),

  openEditModal: (address) => set({
    isEditModalOpen: true,
    selectedAddress: address,
  }),

  closeEditModal: () => set({
    isEditModalOpen: false,
    selectedAddress: null,
  }),

  openDeleteDialog: (address) => set({
    isDeleteDialogOpen: true,
    selectedAddress: address,
  }),

  closeDeleteDialog: () => set({
    isDeleteDialogOpen: false,
    selectedAddress: null,
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find((addr) => addr.isDefault) || null;
  },

  getAddressById: (addressId) => {
    const { addresses } = get();
    return addresses.find((addr) => addr._id === addressId) || null;
  },
}));

// Selector hooks for optimized re-renders
export const useAddresses = () => useAddressStore((state) => state.addresses);
export const useSelectedAddress = () => useAddressStore((state) => state.selectedAddress);
export const useIsAddModalOpen = () => useAddressStore((state) => state.isAddModalOpen);
export const useIsEditModalOpen = () => useAddressStore((state) => state.isEditModalOpen);
export const useIsDeleteDialogOpen = () => useAddressStore((state) => state.isDeleteDialogOpen);
export const useIsAddressLoading = () => useAddressStore((state) => state.isLoading);
export const useAddressError = () => useAddressStore((state) => state.error);
export const useDefaultAddress = () => useAddressStore((state) => state.getDefaultAddress());
