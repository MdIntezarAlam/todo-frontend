'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils/handler';
import Loader from '@/components/common/Loader';
import axios from 'axios';
import { env } from '@/lib/utils/configs/env';
import { useAuth } from '@/lib/slice';

const validator = z
  .object({
    newPassword: z.string().min(8, 'Invalid Password'),
    conPassword: z.string().min(1, 'Required'),
  })
  .refine((val) => val.newPassword === val.conPassword, {
    message: 'confirm password & new password must be same',
    path: ['conPassword'],
  });

export default function UpdatePassword() {
  const [change, setChange] = useState(false);
  const { auth } = useAuth();

  const formHook = useForm<z.infer<typeof validator>>({
    defaultValues: undefined,
    resolver: zodResolver(validator),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: z.infer<typeof validator>) => {
      await axios.put(
        `${env.AUTH_URL}/change-password/${auth?.account._id}`,
        val
      );
      toast.success('Password changed successfully');
      setChange(false);
      formHook.reset();
    },
    onError: (error) => {
      console.log(error);
      const err = getErrorMessage(error);
      toast.error(err);
    },
  });

  return (
    <>
      <Loader isLoading={onSubmit.isPending} />
      {change ? (
        <form
          onSubmit={formHook.handleSubmit((values) => {
            onSubmit.mutate(values);
          })}
          className='flex flex-col gap-y-5'
        >
          <Input
            label='New Password'
            placeholder='Enter your new password'
            type='password'
            {...formHook.register('newPassword')}
            error={formHook.formState.errors.newPassword?.message}
          />

          <Input
            label='Confirm Password'
            placeholder='Enter your confirm password'
            type='password'
            {...formHook.register('conPassword')}
            error={formHook.formState.errors.conPassword?.message}
          />

          <div className='mt-10 flex items-center gap-x-5'>
            <Button
              type='button'
              variant={'outline'}
              onClick={() => setChange(false)}
            >
              Cancel
            </Button>
            <Button>Update Password</Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setChange(true)}
          variant={'primary'}
          className='h-10 w-1/2 rounded-md text-sm lg:w-1/4'
        >
          Change Password
        </Button>
      )}
    </>
  );
}
