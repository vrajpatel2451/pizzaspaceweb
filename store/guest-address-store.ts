import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const GUEST_ADDRESS_STORAGE_KEY = 'pizzaspace-guest-address';

interface GuestAddressState {
  guestAddressId: string | null;
}

interface GuestAddressActions {
  setGuestAddressId: (addressId: string) => void;
  clearGuestAddressId: () => void;
}

type GuestAddressStore = GuestAddressState & GuestAddressActions;

export const useGuestAddressStore = create<GuestAddressStore>()(
  persist(
    (set) => ({
      guestAddressId: null,

      setGuestAddressId: (addressId) => set({ guestAddressId: addressId }),

      clearGuestAddressId: () => set({ guestAddressId: null }),
    }),
    {
      name: GUEST_ADDRESS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selector hooks
export const useGuestAddressId = () => useGuestAddressStore((state) => state.guestAddressId);
