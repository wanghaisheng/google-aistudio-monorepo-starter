/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter, User, Session, QueryOptions } from '../IStorageAdapter';
import { Result } from '../../utils/Result';

/**
 * D1Adapter is a stub for Cloudflare D1.
 * In a real scenario, this would call a Cloudflare Worker API.
 */
export class D1Adapter implements IStorageAdapter {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    try {
      const res = await fetch(`${this.apiUrl}/auth/me`);
      if (!res.ok) return { ok: true, data: null, source: 'server' };
      const data = await res.json();
      return { ok: true, data, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async signIn(email: string, password?: string): Promise<Result<Session>> {
    try {
      const res = await fetch(`${this.apiUrl}/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign in failed');
      return { ok: true, data: data as Session, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async signOut(): Promise<Result<void>> {
    try {
      await fetch(`${this.apiUrl}/auth/signout`, { method: 'POST' });
      return { ok: true, data: undefined, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async create<T>(collection: string, data: T): Promise<Result<T>> {
    try {
      const res = await fetch(`${this.apiUrl}/db/${collection}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Create failed');
      return { ok: true, data: result.data as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async read<T>(collection: string, id: string): Promise<Result<T | null>> {
    try {
      const res = await fetch(`${this.apiUrl}/db/${collection}/${id}`);
      const result = await res.json();
      if (!res.ok) return { ok: true, data: null, source: 'server' };
      return { ok: true, data: result.data as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<Result<T>> {
    try {
      const res = await fetch(`${this.apiUrl}/db/${collection}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Update failed');
      return { ok: true, data: result.data as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async delete(collection: string, id: string): Promise<Result<void>> {
    try {
      const res = await fetch(`${this.apiUrl}/db/${collection}/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');
      return { ok: true, data: undefined, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async query<T>(collection: string, options?: QueryOptions): Promise<Result<T[]>> {
    try {
      const params = new URLSearchParams();
      if (options?.filter) params.append('filter', JSON.stringify(options.filter));
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.orderBy) params.append('orderBy', JSON.stringify(options.orderBy));

      const res = await fetch(`${this.apiUrl}/db/${collection}?${params.toString()}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Query failed');
      return { ok: true, data: result.data as T[], source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }
}
