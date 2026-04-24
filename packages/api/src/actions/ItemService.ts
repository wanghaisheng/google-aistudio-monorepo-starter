/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter } from '@shared/storage/IStorageAdapter';
import { Item } from '@shared/entities/Item';
import { ItemSchema } from '@shared/schemas/ItemSchema';

// Note: In a real monorepo these would be alias imports like '@repo/shared'
// but for this structure we'll use relative paths initially or configure tsconfig paths.

const COLLECTIONS = {
  ITEMS: 'items'
};

export class ItemService {
  constructor(private storage: IStorageAdapter) {}

  async getItems(): Promise<Item[]> {
    const result = await this.storage.query<Item>(COLLECTIONS.ITEMS);
    if (!result.ok) throw (result as any).error;
    
    // Validate each item
    return result.data.map(item => ItemSchema.parse(item));
  }

  async addItem(name: string, description: string): Promise<Item> {
    const userResult = await this.storage.getCurrentUser();
    if (!userResult.ok) throw (userResult as any).error;
    const user = userResult.data;
    
    // Validate input before creating
    const newItem = ItemSchema.parse({
      id: crypto.randomUUID(),
      name,
      description,
      user_id: user?.id,
    });
    
    const result = await this.storage.create<Item>(COLLECTIONS.ITEMS, newItem);
    if (!result.ok) throw (result as any).error;
    return ItemSchema.parse(result.data);
  }

  async updateItem(id: string, name: string, description: string): Promise<Item> {
    const result = await this.storage.update<Item>(COLLECTIONS.ITEMS, id, { name, description });
    if (!result.ok) throw (result as any).error;
    return ItemSchema.parse(result.data);
  }

  async deleteItem(id: string): Promise<void> {
    const result = await this.storage.delete(COLLECTIONS.ITEMS, id);
    if (!result.ok) throw (result as any).error;
  }
}
