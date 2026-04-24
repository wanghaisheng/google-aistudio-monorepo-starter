/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const COLLECTIONS = {
  ITEMS: 'items',
  USERS: 'users',
} as const;

export const STORAGE_KEYS = {
  SSR_CACHE_PREFIX: 'ssr:',
} as const;

export const SYSTEM_META = {
  VERSION: 'V2.0',
  CONTRACT: 'STORAGE_ADAPTER_CONTRACT',
  PROVIDER_STATUS: 'DYNAMIC_PROVIDER_INJECTION_ACTIVE',
  LOCALE_ID: 'EN_US_UTF8',
  REGION: 'global-v1',
  ENV: 'Production',
  MOCK_USER_ID: 'local-user',
  MOCK_USER_EMAIL: 'whs860603@gmail.com',
} as const;

export const LOG_MESSAGES = {
  CACHE_WARM_START: '🔥 Warming cache for hot routes...',
  CACHE_WARM_END: (count: number) => `✅ Warmed ${count} routes.`,
  CACHE_HIT: (url: string) => `[Cache Hit] ${url}`,
  CACHE_MISS: (url: string) => `[Cache Miss] SSR rendering ${url}...`,
  SERVER_START: (port: number) => `🚀 Server running on http://localhost:${port}`,
} as const;
