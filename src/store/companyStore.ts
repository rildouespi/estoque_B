import { create } from 'zustand';
import { Company } from '../types';

interface CompanyState {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [
    { id: '1', name: 'Tech Corp', cnpj: '12.345.678/0001-90' },
    { id: '2', name: 'Global Industries', cnpj: '98.765.432/0001-10' },
  ],
  addCompany: (company) =>
    set((state) => ({
      companies: [
        ...state.companies,
        { ...company, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateCompany: (id, company) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, ...company } : c
      ),
    })),
  deleteCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    })),
}));