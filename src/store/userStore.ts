import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Company Operator',
      email: 'operator@example.com',
      role: 'company_operator',
      companyIds: ['1'],
    },
  ],
  addUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        { ...user, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateUser: (id, user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));