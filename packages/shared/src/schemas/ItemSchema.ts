/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  user_id: z.string().optional(),
});

export type ItemInput = z.infer<typeof ItemSchema>;
