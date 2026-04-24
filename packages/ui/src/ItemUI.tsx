/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, Pencil, Save, X, Check } from 'lucide-react';
import { Button } from '@web/components/ui/button';
import { Item } from '@shared/entities/Item';

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string, description: string) => void;
  labels: {
    noItems: string;
  };
}

export const ItemList: React.FC<ItemListProps> = ({ items, onDelete, onUpdate, labels }) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editDesc, setEditDesc] = React.useState('');

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDesc(item.description);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editName, editDesc);
    setEditingId(null);
  };

  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8 text-xs">{labels.noItems}</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
        >
          {editingId === item.id ? (
            <div className="flex-grow space-y-2 mr-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-1 text-sm rounded border border-border"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full p-1 text-[10px] rounded border border-border"
              />
            </div>
          ) : (
            <div className="overflow-hidden">
              <h3 className="text-sm font-medium truncate">{item.name}</h3>
              <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
            </div>
          )}
          <div className="flex items-center">
            {editingId === item.id ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => saveEdit(item.id)} className="h-7 w-7 text-emerald-500">
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="h-7 w-7 text-muted-foreground">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : deletingId === item.id ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => { onDelete(item.id); setDeletingId(null); }} className="h-7 w-7 text-destructive">
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeletingId(null)} className="h-7 w-7 text-muted-foreground">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingId(item.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface ItemFormProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAdd: () => void;
  labels: {
    add: string;
    name: string;
    description: string;
  };
}

export const ItemForm: React.FC<ItemFormProps> = ({ 
  name, 
  description, 
  onNameChange, 
  onDescriptionChange, 
  onAdd, 
  labels 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{labels.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 text-sm rounded-md border border-border bg-muted/40 focus:border-primary/50 focus:ring-0 transition-colors"
          placeholder={labels.name}
        />
      </div>
      <div className="space-y-1.5 flex-grow flex flex-col">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{labels.description}</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 text-sm rounded-md border border-border bg-muted/40 focus:border-primary/50 focus:ring-0 transition-colors flex-grow resize-none"
          placeholder={labels.description}
        />
      </div>
      <Button type="submit" className="w-full py-5 font-bold uppercase tracking-wider text-xs">
        <Plus className="mr-2 h-3.5 w-3.5" />
        {labels.add}
      </Button>
    </form>
  );
};
