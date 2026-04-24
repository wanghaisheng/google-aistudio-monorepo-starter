/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Session } from '../schemas/AuthSchemas';
import { Result } from '../utils/Result';

export type { User, Session };

export interface QueryOptions {
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: { column: string; ascending?: boolean };
}

/**
 * IStorageAdapter defines the unified contract for CRUD, Auth, and Query.
 */
export interface IStorageAdapter {
  // Auth
  getCurrentUser(): Promise<Result<User | null>>;
  signIn(email: string, password?: string): Promise<Result<Session>>;
  signOut(): Promise<Result<void>>;

  // CRUD
  create<T>(collection: string, data: T): Promise<Result<T>>;
  read<T>(collection: string, id: string): Promise<Result<T | null>>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<Result<T>>;
  delete(collection: string, id: string): Promise<Result<void>>;

  // Query
  query<T>(collection: string, options?: QueryOptions): Promise<Result<T[]>>;
}
