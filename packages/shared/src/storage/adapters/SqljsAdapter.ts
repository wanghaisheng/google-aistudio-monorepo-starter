/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import initSqlJs, { Database } from 'sql.js';
import { IStorageAdapter, User, Session, QueryOptions } from '../IStorageAdapter';
import { Result } from '../../utils/Result';
import { config } from '@core/config';
import { COLLECTIONS, SYSTEM_META } from '@core/constants';

export class SqljsAdapter implements IStorageAdapter {
  private db: Database | null = null;
  private currentUser: User | null = null;

  async init() {
    try {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `${config.sqljs.wasmUrl}${file}`,
      });
      this.db = new SQL.Database();
      // Initialize some tables for demo
      this.db.run(`CREATE TABLE IF NOT EXISTS ${COLLECTIONS.USERS} (id TEXT PRIMARY KEY, email TEXT, name TEXT, role TEXT)`);
      this.db.run(`CREATE TABLE IF NOT EXISTS ${COLLECTIONS.ITEMS} (id TEXT PRIMARY KEY, name TEXT, description TEXT, user_id TEXT)`);
      
      // Mock a user for local demo
      this.currentUser = { 
        id: crypto.randomUUID(), 
        email: SYSTEM_META.MOCK_USER_EMAIL,
        name: 'SqlJS User',
        role: 'admin'
      };
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error);
      throw new Error(`SQL.js initialization failed. Please check if the WASM file at ${config.sqljs.wasmUrl} is accessible.`);
    }
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
    return { 
      ok: true, 
      data: {
        token: 'sqljs-mock-token',
        user: this.currentUser,
        expiresAt: Date.now() + 86400000
      }, 
      source: 'local' 
    };
  }

  async signOut(): Promise<Result<void>> {
    this.currentUser = null;
    return { ok: true, data: undefined, source: 'local' };
  }

  async create<T>(collection: string, data: T): Promise<Result<T>> {
    if (!this.db) return { ok: false, error: new Error('DB not initialized') };
    const keys = Object.keys(data as object);
    const values = Object.values(data as object) as any[];
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${collection} (${keys.join(',')}) VALUES (${placeholders})`;
    try {
      this.db.run(sql, values);
      return { ok: true, data, source: 'local' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async read<T>(collection: string, id: string): Promise<Result<T | null>> {
    if (!this.db) return { ok: false, error: new Error('DB not initialized') };
    try {
      const stmt = this.db.prepare(`SELECT * FROM ${collection} WHERE id = ?`);
      stmt.bind([id] as any[]);
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      return { ok: true, data: (result as unknown as T) || null, source: 'local' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<Result<T>> {
    if (!this.db) return { ok: false, error: new Error('DB not initialized') };
    const keys = Object.keys(data);
    const values = Object.values(data) as any[];
    const setClause = keys.map(k => `${k} = ?`).join(',');
    const sql = `UPDATE ${collection} SET ${setClause} WHERE id = ?`;
    try {
      this.db.run(sql, [...values, id] as any[]);
      const updated = await this.read<T>(collection, id);
      return updated as any;
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async delete(collection: string, id: string): Promise<Result<void>> {
    if (!this.db) return { ok: false, error: new Error('DB not initialized') };
    try {
      this.db.run(`DELETE FROM ${collection} WHERE id = ?`, [id] as any[]);
      return { ok: true, data: undefined, source: 'local' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }

  async query<T>(collection: string, options?: QueryOptions): Promise<Result<T[]>> {
    if (!this.db) return { ok: false, error: new Error('DB not initialized') };
    let sql = `SELECT * FROM ${collection}`;
    const params: any[] = [];

    if (options?.filter) {
      const filters = Object.entries(options.filter).map(([key, value]) => {
        params.push(value);
        return `${key} = ?`;
      });
      sql += ` WHERE ${filters.join(' AND ')}`;
    }

    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy.column} ${options.orderBy.ascending ? 'ASC' : 'DESC'}`;
    }

    if (options?.limit) {
      sql += ` LIMIT ${options.limit}`;
    }

    if (options?.offset) {
      sql += ` OFFSET ${options.offset}`;
    }

    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params);
      const results: T[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as unknown as T);
      }
      stmt.free();
      return { ok: true, data: results, source: 'local' };
    } catch (e: any) {
      return { ok: false, error: e };
    }
  }
}
