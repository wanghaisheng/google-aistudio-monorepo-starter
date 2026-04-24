/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StorageProviderType = 'supabase' | 'sqljs' | 'd1' | 'local';

export interface AppConfig {
  storageProvider: StorageProviderType;
  supabase: {
    url: string;
    key: string;
  };
  d1: {
    apiUrl: string;
  };
  sqljs: {
    wasmUrl: string;
  };
}

export const config: AppConfig = {
  storageProvider: (import.meta.env.VITE_STORAGE_PROVIDER as StorageProviderType) || 'local',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  d1: {
    apiUrl: import.meta.env.VITE_D1_API_URL || '',
  },
  sqljs: {
    wasmUrl: import.meta.env.VITE_SQLJS_WASM_URL || 'https://unpkg.com/sql.js@1.14.1/dist/',
  },
};
