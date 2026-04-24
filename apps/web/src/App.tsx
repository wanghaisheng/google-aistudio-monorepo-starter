/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StorageProvider } from '@web/storage/StorageProvider';
import { useItems } from '@web/hooks/useItems';
import { useAuth } from '@web/hooks/useAuth';
import { useI18n } from '@core/i18n/en';
import { ItemList, ItemForm } from '@ui/ItemUI';
import { ConsoleWidget } from '@ui/ConsoleUI';
import { Shell } from '@web/layout/Shell';
import { AnimatePresence } from 'motion/react';

function Dashboard() {
  const { items, loading, addItem, deleteItem, updateItem, form } = useItems();
  const { user, signOut } = useAuth();
  const i18n = useI18n();

  return (
    <Shell user={user} onSignOut={signOut}>
      <div className="grid grid-cols-12 grid-rows-8 gap-4 h-full flex-grow">
        {/* Input Section */}
        <div className="col-span-12 lg:col-span-4 row-span-8 lg:row-span-4 h-full">
          <ConsoleWidget title={i18n.items.add} subtitle="entry_buffer_01">
            <ItemForm 
              name={form.name}
              description={form.description}
              onNameChange={form.setName}
              onDescriptionChange={form.setDescription}
              onAdd={addItem} 
              labels={i18n.items} 
            />
          </ConsoleWidget>
        </div>

        {/* List Section */}
        <div className="col-span-12 lg:col-span-8 row-span-8 lg:row-span-8 h-full">
          <ConsoleWidget 
            title={i18n.items.title} 
            subtitle={`registry_total: ${items.length}`}
          >
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <ItemList items={items} onDelete={deleteItem} onUpdate={updateItem} labels={i18n.items} />
                  </AnimatePresence>
                )}
              </div>
            </div>
          </ConsoleWidget>
        </div>

        {/* Architecture Info (Bento Placeholder) */}
        <div className="hidden lg:block col-span-4 row-span-4 h-full">
          <ConsoleWidget title={i18n.app.architecture} subtitle="system_manifest_v1.0">
            <div className="font-mono text-[11px] text-blue-400 bg-secondary/80 p-3 rounded-lg h-full overflow-hidden leading-snug">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify({
                  core: {
                    logic: "fully_decoupled",
                    ui: "abstract_base",
                    storage: "contract_based"
                  },
                  runtime: {
                    state: "reactive",
                    adapter: "local_storage",
                    theme: "bento_console",
                    package: "apps/web"
                  }
                }, null, 2)}
              </pre>
            </div>
          </ConsoleWidget>
        </div>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <StorageProvider>
      <Dashboard />
    </StorageProvider>
  );
}
