import { cookies } from "next/headers";

const STORE_COOKIE_NAME = "selectedStoreId";

/**
 * Get the selected store ID from cookies (server-side)
 * @returns The store ID or null if not set
 */
export async function getStoreIdFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const storeId = cookieStore.get(STORE_COOKIE_NAME)?.value;
    return storeId || null;
  } catch (error) {
    console.error("Failed to get store ID from cookies:", error);
    return null;
  }
}

/**
 * Set store cookie (client-side)
 * @param storeId - The store ID to set
 */
export function setStoreCookie(storeId: string): void {
  if (typeof window === "undefined") {
    throw new Error("setStoreCookie can only be called on the client");
  }
  document.cookie = `${STORE_COOKIE_NAME}=${storeId}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Clear store cookie (client-side)
 */
export function clearStoreCookie(): void {
  if (typeof window === "undefined") {
    throw new Error("clearStoreCookie can only be called on the client");
  }
  document.cookie = `${STORE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
