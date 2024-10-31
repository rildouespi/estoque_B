import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Company Operator',
    email: 'operator@example.com',
    role: 'company_operator' as const,
    companyIds: ['1'],
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Mock authentication - replace with real API call
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === 'password') {
      set({ user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));