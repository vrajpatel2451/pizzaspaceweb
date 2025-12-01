'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getAddresses,
  createAddress,
  updateAddress,
  patchAddress,
  deleteAddress,
} from '@/lib/api/address';
import { useAddressStore } from '@/store/address-store';
import { AddAddressData, AddressResponse } from '@/types';

/**
 * Hook to fetch and manage addresses
 * @param autoFetch - Whether to automatically fetch addresses on mount (default: true)
 */
export function useAddresses(autoFetch: boolean = true) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addresses, setAddresses, setLoading: setStoreLoading } =
    useAddressStore();

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setStoreLoading(true);
    setError(null);

    try {
      const response = await getAddresses();

      if (response.statusCode === 200 && response.data) {
        setAddresses(response.data);
      } else {
        const errorMsg = response.errorMessage || 'Failed to fetch addresses';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while fetching addresses';
      setError(errorMsg);
      console.error('Fetch addresses error:', err);
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  }, [setAddresses, setStoreLoading]);

  // Auto-fetch addresses on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      // Wrap in setTimeout to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        fetchAddresses();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFetch, fetchAddresses]);

  return {
    addresses,
    isLoading,
    error,
    refetch: fetchAddresses,
  };
}

/**
 * Hook to create a new address
 */
export function useCreateAddress() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    addAddress,
    setLoading: setStoreLoading,
    closeAddModal,
  } = useAddressStore();

  const mutate = useCallback(
    async (data: AddAddressData) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await createAddress(data);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          addAddress(response.data);
          toast.success('Address added successfully');
          closeAddModal();
          return { success: true, data: response.data };
        } else {
          const errorMsg = response.errorMessage || 'Failed to add address';
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred';
        toast.error(errorMsg);
        console.error('Create address error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [addAddress, setStoreLoading, closeAddModal]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to update an existing address (full update)
 */
export function useUpdateAddress() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    updateAddress: updateAddressInStore,
    setLoading: setStoreLoading,
    closeEditModal,
  } = useAddressStore();

  const mutate = useCallback(
    async (addressId: string, data: AddAddressData) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await updateAddress(addressId, data);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          updateAddressInStore(addressId, response.data);
          toast.success('Address updated successfully');
          closeEditModal();
          return { success: true, data: response.data };
        } else {
          const errorMsg = response.errorMessage || 'Failed to update address';
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred';
        toast.error(errorMsg);
        console.error('Update address error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [updateAddressInStore, setStoreLoading, closeEditModal]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to delete an address with confirmation
 */
export function useDeleteAddress() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    removeAddress,
    setLoading: setStoreLoading,
    closeDeleteDialog,
  } = useAddressStore();

  const mutate = useCallback(
    async (addressId: string, skipConfirmation: boolean = false) => {
      // If confirmation is required and not skipped, return early
      // The component should handle showing a confirmation dialog
      if (!skipConfirmation) {
        return {
          success: false,
          requiresConfirmation: true,
          error: 'Confirmation required',
        };
      }

      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await deleteAddress(addressId);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          removeAddress(addressId);
          toast.success('Address deleted successfully');
          closeDeleteDialog();
          return { success: true };
        } else {
          const errorMsg = response.errorMessage || 'Failed to delete address';
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred';
        toast.error(errorMsg);
        console.error('Delete address error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [removeAddress, setStoreLoading, closeDeleteDialog]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to set an address as default
 */
export function useSetDefaultAddress() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setDefaultAddress,
    setLoading: setStoreLoading,
  } = useAddressStore();

  const mutate = useCallback(
    async (addressId: string) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        // Use patch to update only the isDefault field
        const response = await patchAddress(addressId, { isDefault: true });

        if (response.statusCode === 200 && response.data) {
          // Update all addresses in store (set only this one as default)
          setDefaultAddress(addressId);
          toast.success('Default address updated');
          return { success: true, data: response.data };
        } else {
          const errorMsg =
            response.errorMessage || 'Failed to set default address';
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = 'An unexpected error occurred';
        toast.error(errorMsg);
        console.error('Set default address error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [setDefaultAddress, setStoreLoading]
  );

  return {
    mutate,
    isLoading,
  };
}
