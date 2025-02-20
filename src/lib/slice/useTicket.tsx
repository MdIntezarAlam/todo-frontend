import { type TypeTicket } from '@/types/TypeTicket';
import { create } from 'zustand';

interface IAuthState {
  ticketData: TypeTicket['data'] | undefined;
  setTicketData: (user: TypeTicket['data'] | undefined) => void;
}

export const useTicket = create<IAuthState>((set) => ({
  ticketData: undefined,
  setTicketData: (ticket) => set({ ticketData: ticket }),
}));
