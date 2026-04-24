/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@shared/utils/cn';
import { motion } from 'motion/react';

interface ConsoleWidgetProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const ConsoleWidget: React.FC<ConsoleWidgetProps> = ({ 
  title, 
  subtitle, 
  children, 
  className,
  animate = true 
}) => {
  const content = (
    <div className={cn(
      "bg-card border border-border rounded-xl p-4 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors",
      className
    )}>
      {/* Decorative visible grid effect in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]" />
      
      {title && (
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground leading-none mb-1">
              {title}
            </span>
            {subtitle && (
              <span className="text-[8px] font-mono text-muted-foreground/50 uppercase leading-none">
                {subtitle}
              </span>
            )}
          </div>
          {/* Hardware-like status dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      )}
      
      <div className="relative z-10 flex-grow">
        {children}
      </div>
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      {content}
    </motion.div>
  );
};
