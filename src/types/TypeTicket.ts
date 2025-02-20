export interface TypeTicket {
  message: string;
  success: boolean;
  data: TicketData[];
}

export interface TicketData {
  _id: string;
  subject: string;
  description: string;
  reasonType: string;
  __v: number;
}
