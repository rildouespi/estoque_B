export type UserRole = 'admin' | 'company_operator' | 'regular_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyIds?: string[];
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  companyId: string;
  quantity: number;
  unitPrice: number;
  icmsRate: number;
}

export interface Transaction {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  unitPrice: number;
  icmsRate: number;
  salePrice?: number;
  profit?: number;
  date: string;
}