/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useStorage } from '../storage/StorageProvider';
import { ItemService } from '@api/actions/ItemService';
import { Item } from '@shared/entities/Item';

export const useItems = () => {
  const storage = useStorage();
  const service = useMemo(() => new ItemService(storage), [storage]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  // Form state managed in hook for "stateless" UI components
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const itemsData = await service.getItems();
      setItems(itemsData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [service]);

  const addItem = async () => {
    if (!formName.trim()) return;
    try {
      const newItem = await service.addItem(formName, formDescription);
      setItems(prev => [...prev, newItem]);
      setFormName('');
      setFormDescription('');
    } catch (err) {
      setError(err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await service.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  const updateItem = async (id: string, name: string, description: string) => {
    try {
      const updatedItem = await service.updateItem(id, name, description);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError(err);
    }
  };

  return { 
    items, 
    loading, 
    error, 
    addItem, 
    deleteItem,
    updateItem,
    refresh: fetchData,
    form: {
      name: formName,
      description: formDescription,
      setName: setFormName,
      setDescription: setFormDescription
    }
  };
};
