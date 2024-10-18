
import { cn } from '@/lib/utils/utils';
import { type TicketData } from '@/types/TypeTicket'
import { useRouter, useSearchParams } from 'next/navigation';

export default function ViewTicket(props: TicketData) {
    const { description, subject, reasonType, _id } = props

    const searchParams = useSearchParams()
    const router = useRouter()


    return (
        <div onClick={() => {
            const parmas = new URLSearchParams(searchParams.toString())
            parmas.set('ticket', _id)
            router.replace(`?${parmas.toString()}`)
        }} className={cn('w-full  flex flex-col  shadow-sm p-4 rounded-md border bg-background text-sm font-bold', {
            'border-green-400': _id === searchParams.get('ticket'),
        })}>
            <h1>Id : <span className='font-medium text-xs'>{_id}</span></h1>
            <h1>Reason : <span className='font-medium text-xs'>{reasonType}</span></h1>
            <h1>Subject : <span className='font-medium text-xs'>{subject}</span></h1>
            <h1>Description : <span className='font-medium text-xs line-clamp-2'>{description}</span></h1>
        </div>
    )
}
