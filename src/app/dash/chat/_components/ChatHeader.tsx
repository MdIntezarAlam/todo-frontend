import React from 'react';

export default function ChatHeader({
  username,
  ticketId,
}: {
  username: string;
  ticketId: string;
}) {
  return (
    <nav className='mb-auto flex h-14 w-full flex-col rounded-t-md bg-background p-3 shadow-xl'>
      <div className='flex items-center'>
        <h1 className='text-sm font-medium'>From :</h1>
        <h1 className='text-sm font-medium'>{username}</h1>
      </div>
      <div className='flex items-center'>
        <h1 className='text-sm font-medium'>TicketId :</h1>
        <h1 className='text-sm font-medium'>{ticketId}</h1>
      </div>
    </nav>
  );
}
