import { create } from 'zustand';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      category: 'Electronics',
    },
    {
      id: '2',
      name: 'Office Chair',
      description: 'Ergonomic office chair',
      category: 'Furniture',
    },
  ],
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));