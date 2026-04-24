/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useI18n } from '@core/i18n/en';
import { SYSTEM_META } from '@core/constants';
import { Button } from '@web/components/ui/button';
import { User } from '@shared/schemas/AuthSchemas';

interface ShellProps {
  user: User | null;
  onSignOut: () => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ user, onSignOut, children }) => {
  const i18n = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col gap-4">
      <header className="flex justify-between items-center pb-2">
        <div className="header-title">
          <h1 className="text-xl font-semibold tracking-tight">
            {i18n.app.title.toUpperCase()} <span className="text-muted-foreground font-light">{i18n.app.subtitle}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 text-[10px] font-mono text-muted-foreground uppercase">
            <div className="px-2 py-1 bg-card border border-emerald-500/30 text-emerald-500 rounded">{i18n.app.status.env}: {SYSTEM_META.ENV}</div>
            <div className="px-2 py-1 bg-card border border-emerald-500/30 text-emerald-500 rounded">{i18n.app.status.zeroHardcode}: {i18n.app.status.enabled}</div>
            <div className="px-2 py-1 bg-card border border-border rounded">{i18n.app.status.region}: {SYSTEM_META.REGION}</div>
          </div>
          
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">{i18n.app.session.active}</div>
                <div className="text-xs font-medium text-foreground leading-none">{user.email}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSignOut}
                className="text-[10px] font-bold uppercase tracking-wider h-8 px-3 border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              >
                {i18n.auth.signOut}
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="flex justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border">
        <div>{SYSTEM_META.CONTRACT}_{SYSTEM_META.VERSION}</div>
        <div className="hidden sm:block">{SYSTEM_META.PROVIDER_STATUS}</div>
        <div>LOCALIZATION_LAYER_ID: {SYSTEM_META.LOCALE_ID}</div>
      </footer>
    </div>
  );
};
