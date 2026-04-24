/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CacheAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
}

/**
 * MemoryCacheAdapter is a local implementation of the CacheAdapter interface.
 * In production, this would be replaced by Cloudflare KV.
 */
export class MemoryCacheAdapter implements CacheAdapter {
  private cache = new Map<string, { value: string; expires: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expires && entry.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expires = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { value, expires });
  }
}
