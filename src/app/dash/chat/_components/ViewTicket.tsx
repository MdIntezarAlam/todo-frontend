import { cn } from '@/lib/utils/utils';
import { type TicketData } from '@/types/TypeTicket';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ViewTicket(props: TicketData) {
  const { description, subject, reasonType, _id } = props;

  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        const parmas = new URLSearchParams(searchParams.toString());
        parmas.set('ticket', _id);
        router.replace(`?${parmas.toString()}`);
      }}
      className={cn(
        'flex w-full flex-col rounded-md border bg-background p-4 text-sm font-bold shadow-sm',
        {
          'border-green-400': _id === searchParams.get('ticket'),
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
