import { create } from 'zustand';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
        },
        ...state.transactions,
      ],
    })),
}));