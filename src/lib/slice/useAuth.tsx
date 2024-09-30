import { type TAccount } from '@/types/TUsers';
import { create } from 'zustand';

interface IAuthState {
  currentUser: TAccount | null;
  setCurrentUser: (user: TAccount | null) => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
