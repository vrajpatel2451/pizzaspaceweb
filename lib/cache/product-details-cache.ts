import type { ProductDetailsResponse } from "@/types/product";

/**
 * Cache entry with TTL
 */
interface CacheEntry {
  data: ProductDetailsResponse;
  timestamp: number;
  expiresAt: number;
}

/**
 * Simple in-memory cache for product details
 * Includes TTL (time-to-live) for automatic expiration
 */
class ProductDetailsCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get cached product details
   * Returns undefined if not in cache or expired
   */
  get(productId: string): ProductDetailsResponse | undefined {
    const entry = this.cache.get(productId);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(productId);
      return undefined;
    }

    return entry.data;
  }

  /**
   * Set product details in cache
   * Automatically sets expiration based on TTL
   */
  set(
    productId: string,
    data: ProductDetailsResponse,
    ttl: number = this.defaultTTL
  ): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;

    this.cache.set(productId, {
      data,
      timestamp,
      expiresAt,
    });
  }

  /**
   * Check if product is in cache (and not expired)
   */
  has(productId: string): boolean {
    const entry = this.cache.get(productId);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(productId);
      return false;
    }

    return true;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear specific product from cache
   */
  delete(productId: string): boolean {
    return this.cache.delete(productId);
  }

  /**
   * Get cache size
   */
  size(): number {
    // Clean up expired entries first
    this.cleanupExpired();
    return this.cache.size;
  }

  /**
   * Remove expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [productId, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(productId);
      }
    }
  }

  /**
   * Set default TTL for cache entries
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: Array<{ productId: string; expiresIn: number }>;
  } {
    this.cleanupExpired();
    const now = Date.now();

    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([productId, entry]) => ({
        productId,
        expiresIn: entry.expiresAt - now,
      })),
    };
  }

  /**
   * Force refresh - delete cache entry to trigger refetch
   */
  forceRefresh(productId: string): void {
    this.cache.delete(productId);
  }

  /**
   * Invalidate cache by pattern (regex)
   * Useful for invalidating multiple related products
   */
  invalidateByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const [productId] of this.cache.entries()) {
      if (regex.test(productId)) {
        this.cache.delete(productId);
        count++;
      }
    }

    return count;
  }

  /**
   * Update TTL for a specific cache entry
   */
  updateTTL(productId: string, newTTL: number): boolean {
    const entry = this.cache.get(productId);

    if (!entry) {
      return false;
    }

    const now = Date.now();
    const updatedEntry = {
      ...entry,
      expiresAt: now + newTTL,
    };

    this.cache.set(productId, updatedEntry);
    return true;
  }
}

// Export singleton instance
export const productDetailsCache = new ProductDetailsCache();
