import { type TAddresses } from '@/types/TAddress';
import { create } from 'zustand';

interface IAdd {
  addressData: TAddresses | null;
  setAddresses: (address: TAddresses) => void;
}

export const useAddressStore = create<IAdd>((set) => ({
  addressData: null,
  setAddresses: (address) => set({ addressData: address }),
}));
