/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { ItemSchema } from '../schemas/ItemSchema';

export type Item = z.infer<typeof ItemSchema>;
