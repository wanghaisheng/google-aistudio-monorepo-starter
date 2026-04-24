/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Result<T, E = Error> = 
  | { ok: true; data: T; source: 'server' | 'cache' | 'local' } 
  | { ok: false; error: E };
