'use client';
import { useEffect, useState } from 'react';
import ViewTicket from './ViewTicket';

import { env } from '@/lib/utils/configs/env';
import { type TypeTicket } from '@/types/TypeTicket';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ChatBox from './ChatBox';
import io, { type Socket } from 'socket.io-client';
import { useTicket } from '@/lib/slice';
import { useSearchParams } from 'next/navigation';
import CreateTicketDialoge from './CreateTicketDialoge';

const socket: Socket = io(env.SOCKET_URL);

export default function SupportDshboard() {
  const { setTicketData, ticketData } = useTicket();
  const [showDialoge, setShowDialoge] = useState<boolean>(false);
  const ticketId = useSearchParams().get('ticket');
  console.log('ticketId', ticketId);

  useEffect(() => {
    setTicketData(data);
  }, [socket, setTicketData]);

  const { data } = useQuery<TypeTicket['data']>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/fetch-ticket`);
      const data = res.data.data as TypeTicket['data'];
      setTicketData(data);
      return data;
    },
  });

  return (
    <main className='mb-5 h-[90vh] w-full overflow-hidden rounded-md border bg-gray-100 p-2'>
      <nav className='mb-auto flex h-14 w-full items-center justify-between gap-2 rounded-t-md bg-background p-3 shadow-xl'>
        <CreateTicketDialoge
          setShowDialoge={setShowDialoge}
          showDialoge={showDialoge}
        />
      </nav>

      <div className='flex h-full w-full gap-4 rounded-md border bg-gray-100 p-2'>
        <section className='flex h-[82vh] w-1/3 flex-col gap-2 rounded-md bg-gray-500/10 p-3'>
          {ticketData && ticketData?.length > 0 ? (
            ticketData?.map((ticket) => (
              <ViewTicket key={ticket._id} {...ticket} />
            ))
          ) : (
            <div className='ml-auto flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border bg-white p-4'>
              <h1 className='text-xl font-bold'>No Ticket Found </h1>
              <h2 className='text-sm font-medium'>
                Please Create A Ticket to Join the Chat
              </h2>
            </div>
          )}
        </section>
        <section className='h-[82vh] w-full rounded-md bg-gray-600/10 p-3'>
          {!ticketId ? (
            <div className='ml-auto flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border bg-white p-4'>
              <h1 className='text-xl font-bold'>No Ticket Found </h1>
              <h2 className='text-lg font-semibold'>
                Please select a ticket from the inbox. Or you can create a new
                ticket
              </h2>
            </div>
          ) : (
            <>
              <ChatBox socket={socket} room={ticketId} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
