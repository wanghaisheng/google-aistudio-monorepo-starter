/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IStorageAdapter, User, Session, QueryOptions } from '../IStorageAdapter';
import { Result } from '../../utils/Result';

export class SupabaseAdapter implements IStorageAdapter {
  private client: SupabaseClient;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    try {
      const { data: { user } } = await this.client.auth.getUser();
      if (!user) return { ok: true, data: null, source: 'server' };
      return { 
        ok: true, 
        data: { id: user.id, email: user.email!, name: user.user_metadata.name || '', role: 'user' }, 
        source: 'server' 
      };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async signIn(email: string, password?: string): Promise<Result<Session>> {
    try {
      if (password) {
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { 
          ok: true, 
          data: {
            token: data.session.access_token,
            user: { id: data.user.id, email: data.user.email!, name: data.user.user_metadata.name || '', role: 'user' },
            expiresAt: data.session.expires_at! * 1000
          }, 
          source: 'server' 
        };
      } else {
        const { error } = await this.client.auth.signInWithOtp({ email });
        if (error) throw error;
        throw new Error('OTP flow not fully implemented in Result pattern');
      }
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async signOut(): Promise<Result<void>> {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { ok: true, data: undefined, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async create<T>(collection: string, data: T): Promise<Result<T>> {
    try {
      const { data: result, error } = await this.client.from(collection).insert(data as any).select().single();
      if (error) throw error;
      return { ok: true, data: result as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async read<T>(collection: string, id: string): Promise<Result<T | null>> {
    try {
      const { data: result, error } = await this.client.from(collection).select().eq('id', id).single();
      if (error) return { ok: true, data: null, source: 'server' };
      return { ok: true, data: result as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<Result<T>> {
    try {
      const { data: result, error } = await this.client.from(collection).update(data as any).eq('id', id).select().single();
      if (error) throw error;
      return { ok: true, data: result as T, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async delete(collection: string, id: string): Promise<Result<void>> {
    try {
      const { error } = await this.client.from(collection).delete().eq('id', id);
      if (error) throw error;
      return { ok: true, data: undefined, source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async query<T>(collection: string, options?: QueryOptions): Promise<Result<T[]>> {
    try {
      let query = this.client.from(collection).select();

      if (options?.filter) {
        for (const [key, value] of Object.entries(options.filter)) {
          query = query.eq(key, value);
        }
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { ok: true, data: data as T[], source: 'server' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }
}
