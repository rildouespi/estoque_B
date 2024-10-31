import { create } from 'zustand';
import { InventoryItem } from '../types';

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [
    {
      id: '1',
      productId: '1',
      companyId: '1',
      quantity: 10,
      unitPrice: 1200,
      icmsRate: 0.18,
    },
  ],
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        { ...item, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateItem: (id, item) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...item } : i)),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));