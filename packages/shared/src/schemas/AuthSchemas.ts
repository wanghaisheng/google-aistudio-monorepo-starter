/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['user', 'admin']),
});

export const SessionSchema = z.object({
  token: z.string(),
  user: UserSchema,
  expiresAt: z.number(), // Timestamp in milliseconds
});

export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof SessionSchema>;
