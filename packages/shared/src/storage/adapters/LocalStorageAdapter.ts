/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter, User, Session, QueryOptions } from '../IStorageAdapter';
import { Result } from '../../utils/Result';

// For the sake of this decoupled example, we'll use a local constant for mock data 
const SYSTEM_META = {
  MOCK_USER_ID: '00000000-0000-0000-0000-000000000001',
  MOCK_USER_EMAIL: 'dev@example.com',
  MOCK_USER_NAME: 'Dev User'
};

export class LocalStorageAdapter implements IStorageAdapter {
  private currentUser: User | null = null;

  constructor() {
    this.currentUser = { 
      id: SYSTEM_META.MOCK_USER_ID, 
      email: SYSTEM_META.MOCK_USER_EMAIL,
      name: SYSTEM_META.MOCK_USER_NAME,
      role: 'admin'
    };
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    return { ok: true, data: this.currentUser, source: 'local' };
  }

  async signIn(email: string, _password?: string): Promise<Result<Session>> {
    this.currentUser = { 
      id: crypto.randomUUID(), 
      email,
      name: email.split('@')[0],
      role: 'user'
    };
    localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
    
    return { 
      ok: true, 
      data: {
        token: 'local-mock-token',
        user: this.currentUser,
        expiresAt: Date.now() + 86400000
      }, 
      source: 'local' 
    };
  }

  async signOut(): Promise<Result<void>> {
    this.currentUser = null;
    localStorage.removeItem('auth_user');
    return { ok: true, data: undefined, source: 'local' };
  }

  async create<T>(collection: string, data: T): Promise<Result<T>> {
    const items = this.getItems(collection);
    items.push(data);
    this.saveItems(collection, items);
    return { ok: true, data, source: 'local' };
  }

  async read<T>(collection: string, id: string): Promise<Result<T | null>> {
    const items = this.getItems(collection);
    const item = items.find((i: any) => i.id === id);
    return { ok: true, data: (item as T) || null, source: 'local' };
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<Result<T>> {
    let items = this.getItems(collection);
    items = items.map((i: any) => i.id === id ? { ...i, ...data } : i);
    this.saveItems(collection, items);
    const updated = items.find((i: any) => i.id === id);
    return { ok: true, data: updated as T, source: 'local' };
  }

  async delete(collection: string, id: string): Promise<Result<void>> {
    let items = this.getItems(collection);
    items = items.filter((i: any) => i.id !== id);
    this.saveItems(collection, items);
    return { ok: true, data: undefined, source: 'local' };
  }

  async query<T>(collection: string, options?: QueryOptions): Promise<Result<T[]>> {
    let items = this.getItems(collection);

    if (options?.filter) {
      items = items.filter((item: any) => {
        return Object.entries(options.filter!).every(([key, value]) => item[key] === value);
      });
    }

    if (options?.orderBy) {
      items.sort((a: any, b: any) => {
        const valA = a[options.orderBy!.column];
        const valB = b[options.orderBy!.column];
        if (valA < valB) return options.orderBy!.ascending ? -1 : 1;
        if (valA > valB) return options.orderBy!.ascending ? 1 : -1;
        return 0;
      });
    }

    if (options?.offset) {
      items = items.slice(options.offset);
    }

    if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return { ok: true, data: items as T[], source: 'local' };
  }

  private getItems(collection: string): any[] {
    const data = localStorage.getItem(`db_${collection}`);
    return data ? JSON.parse(data) : [];
  }

  private saveItems(collection: string, items: any[]) {
    localStorage.setItem(`db_${collection}`, JSON.stringify(items));
  }
}
