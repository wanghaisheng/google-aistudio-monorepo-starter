/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useStorage } from '../storage/StorageProvider';
import { User } from '@shared/schemas/AuthSchemas';

export const useAuth = () => {
  const storage = useStorage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await storage.getCurrentUser();
      if (result.ok) {
        setUser(result.data);
      }
      setLoading(false);
    };
    checkAuth();
  }, [storage]);

  const signOut = async () => {
    const result = await storage.signOut();
    if (result.ok) {
      setUser(null);
    }
  };

  return { user, loading, signOut };
};
