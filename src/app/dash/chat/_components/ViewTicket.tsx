'use client';
import { cn } from '@/lib/utils/utils';
import { type TicketData } from '@/types/TypeTicket';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function ViewTicket(props: TicketData) {
  const { description, subject, reasonType, _id } = props;

  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTicket = useMemo(
    () => searchParams.get('ticket'),
    [searchParams]
  );

  const handleClick = useCallback(() => {
    if (selectedTicket !== _id) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('ticket', _id);
      router.replace(`?${params.toString()}`);
    }
  }, [selectedTicket, _id, searchParams, router]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex w-full flex-col rounded-md border bg-background p-4 text-sm font-bold shadow-sm transition-colors',
        {
          'border-green-400 bg-green-50': _id === selectedTicket,
          'hover:bg-gray-100': _id !== selectedTicket,
        }
      )}
    >
      <h1>
        Id : <span className='text-xs font-medium'>{_id}</span>
      </h1>
      <h1>
        Reason : <span className='text-xs font-medium'>{reasonType}</span>
      </h1>
      <h1>
        Subject : <span className='text-xs font-medium'>{subject}</span>
      </h1>
      <h1>
        Description :{' '}
        <span className='line-clamp-2 text-xs font-medium'>{description}</span>
      </h1>
    </div>
  );
}
