import { type TAddresses } from '@/types/TAddress';
import { create } from 'zustand';

interface IAdd {
  addressData: TAddresses | undefined;
  setAddresses: (address: TAddresses) => void;
}

export const useAddressStore = create<IAdd>((set) => ({
  addressData: undefined,
  setAddresses: (address) => set({ addressData: address }),
}));
