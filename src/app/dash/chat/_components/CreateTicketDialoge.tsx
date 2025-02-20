'use client';
import io, { type Socket } from 'socket.io-client';
import { env } from '@/lib/utils/configs/env';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { getErrorMessage } from '@/lib/utils/handler';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';

// Initialize the socket connection once
const socket: Socket = io(env.SOCKET_URL);

const REASON_TYPE = [
  'normal_contact',
  'order_related',
  'delevery_related',
  'payment_related',
  'other',
] as const;

const validator = z.object({
  subject: z.string().min(1, 'Subject is required'),
  reasonType: z.enum(REASON_TYPE) || 'normal_contact',
  description: z
    .string()
    .min(3, 'Description should be more than 3 characters'),
});

type ticketTypes = z.infer<typeof validator>;

interface Props {
  showDialoge: boolean;
  setShowDialoge: (showDialoge: boolean) => void;
}

export default function CreateTicketDialoge({
  setShowDialoge,
  showDialoge,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticketForm = useForm<ticketTypes>({
    defaultValues: undefined,
    resolver: zodResolver(validator),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: ticketTypes) =>
      await axios.post(`${env.BACKEND_URL}/create-ticket`, val),
    onSuccess: (res) => {
      socket.emit('create_ticket', res.data.data);
      toast.success('Ticket created successfully');

      queryClient.invalidateQueries({ queryKey: ['tickets'] });

      ticketForm.reset();
      setShowDialoge(false);

      const newTicketId = res.data.data._id as string;
      const params = new URLSearchParams(searchParams.toString());
      params.set('ticket', newTicketId);
      router.push(`/dash/chat?${params.toString()}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <Dialog open={showDialoge} onOpenChange={setShowDialoge}>
      <DialogTrigger>
        <Button className='h-10 w-[200px] rounded-md'>Create Ticket</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='my-5 w-fit border-b pb-2'>
            Create Ticket Room
          </DialogTitle>
          <DialogDescription>
            <form
              onSubmit={ticketForm.handleSubmit((val) => onSubmit.mutate(val))}
              className='flex min-h-[40vh] w-full flex-col items-center gap-5 rounded-lg border-2 border-black/10 p-4 shadow'
            >
              <h3 className='my-10 border-b pb-2 text-xl font-bold'>
                Create A Room
              </h3>
              <Input
                label='Enter Subject'
                type='text'
                placeholder='Enter the Subject'
                {...ticketForm.register('subject')}
                error={ticketForm.formState.errors.subject?.message}
              />
              <Input
                type='text'
                label='Enter Description'
                placeholder='Enter the Description'
                {...ticketForm.register('description')}
                error={ticketForm.formState.errors.description?.message}
              />
              <div className='w-full'>
                <Label>Select Reason</Label>
                <Select
                  value={ticketForm.watch('reasonType')}
                  onValueChange={(val) => {
                    ticketForm.setValue(
                      'reasonType',
                      val as (typeof REASON_TYPE)[number]
                    );
                  }}
                >
                  <SelectTrigger className='h-10 !w-full'>
                    <SelectValue placeholder='Select Reason' />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_TYPE.map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type='submit'
                disabled={onSubmit.isPending} // Fixed: Replaced isLoading with isPending
                className='h-10 w-full rounded-md text-sm font-semibold'
              >
                {onSubmit.isPending ? 'Creating...' : 'Create Ticket'}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
