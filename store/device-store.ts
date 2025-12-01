import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateDeviceId, isValidUUID } from '@/lib/utils/device-id';

const DEVICE_STORAGE_KEY = 'pizzaspace-device-id';

interface DeviceState {
  deviceId: string | null;
  isHydrated: boolean;
}

interface DeviceActions {
  initializeDeviceId: () => void;
  setDeviceId: (deviceId: string) => void;
  setHydrated: (isHydrated: boolean) => void;
}

type DeviceStore = DeviceState & DeviceActions;

const initialState: DeviceState = {
  deviceId: null,
  isHydrated: false,
};

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeDeviceId: () => {
        const currentDeviceId = get().deviceId;

        // Only generate new ID if no valid ID exists
        if (!currentDeviceId || !isValidUUID(currentDeviceId)) {
          const newDeviceId = generateDeviceId();
          set({ deviceId: newDeviceId });
        }
      },

      setDeviceId: (deviceId) => set({ deviceId }),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: DEVICE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          // Auto-initialize device ID on hydration if needed
          state.initializeDeviceId();
        }
      },
    }
  )
);

// Selector hooks for optimized re-renders
export const useDeviceId = () => useDeviceStore((state) => state.deviceId);
export const useIsDeviceHydrated = () => useDeviceStore((state) => state.isHydrated);
