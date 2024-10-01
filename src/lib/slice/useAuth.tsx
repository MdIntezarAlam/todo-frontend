import { type TAccount } from '@/types/TUsers';
import { create } from 'zustand';

interface IAuthState {
  auth: TAccount | null;
  setAuth: (user: TAccount | null) => void;
}

export const useAuth = create<IAuthState>((set) => ({
  auth: null,
  setAuth: (user) => set({ auth: user }),
}));
