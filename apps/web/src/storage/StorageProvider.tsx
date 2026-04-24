/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IStorageAdapter } from '@shared/storage/IStorageAdapter';
import { SupabaseAdapter } from '@shared/storage/adapters/SupabaseAdapter';
import { SqljsAdapter } from '@shared/storage/adapters/SqljsAdapter';
import { D1Adapter } from '@shared/storage/adapters/D1Adapter';
import { LocalStorageAdapter } from '@shared/storage/adapters/LocalStorageAdapter';
import { config } from '@core/config';
import { useI18n } from '@core/i18n/en';

const StorageContext = createContext<IStorageAdapter | null>(null);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adapter, setAdapter] = useState<IStorageAdapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const i18n = useI18n();

  useEffect(() => {
    const initAdapter = async () => {
      try {
        let selectedAdapter: IStorageAdapter;

        switch (config.storageProvider) {
          case 'supabase':
            // selectedAdapter = new SupabaseAdapter(config.supabase.url, config.supabase.key);
            // break;
            selectedAdapter = new LocalStorageAdapter();
            break;
          case 'd1':
            selectedAdapter = new D1Adapter(config.d1.apiUrl);
            break;
          case 'sqljs':
            const sqlAdapter = new SqljsAdapter();
            await sqlAdapter.init();
            selectedAdapter = sqlAdapter;
            break;
          case 'local':
          default:
            selectedAdapter = new LocalStorageAdapter();
            break;
        }

        setAdapter(selectedAdapter);
      } catch (err: any) {
        console.error('Storage initialization error:', err);
        setError(err.message || 'Failed to initialize storage');
      }
    };

    initAdapter();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4 text-center">
        <div className="text-destructive mb-4 font-bold">Storage Error</div>
        <div className="text-sm text-muted-foreground max-w-md">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!adapter) {
    return <div className="flex items-center justify-center h-screen">{i18n.app.loadingStorage}</div>;
  }

  return (
    <StorageContext.Provider value={adapter}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
