'use client';
import Loader from '@/components/common/Loader';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/slice';
import { env } from '@/lib/utils/configs/env';
import { getErrorMessage } from '@/lib/utils/handler';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { UpdateIcons } from './UpdateIcons';

const emailValidator = z.object({
  email: z.string().min(3, 'Minimum 3 characters').optional(),
});

type TemailType = z.infer<typeof emailValidator>;

export default function UpdateEmail() {
  const { auth } = useAuth();
  const [email, setEmail] = useState(false);

  const initialValues = {
    email: auth?.account.email,
  };
  const formHook = useForm<TemailType>({
    defaultValues: initialValues,
    resolver: zodResolver(emailValidator),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TemailType) => {
      const res = await axios.put(
        `${env.AUTH_URL}/update/${auth?.account._id}`,
        val
      );
      setEmail(false);
      console.log(res.data);
      toast.success('Email updated successfully');
      return res.data;
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <>
      <Loader isLoading={onSubmit.isPending} />
      <form
        onSubmit={formHook.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
        className='w-full'
      >
        <Input
          type='email'
          placeholder='Email'
          label='Email Address'
          disabled={!email}
          icon={
            <UpdateIcons
              open={email}
              setOpen={setEmail}
              setValue={() => formHook.setValue('email', auth?.account.email)}
              edit={formHook.watch('email') === auth?.account?.email}
            />
          }
          {...formHook.register('email')}
        />
      </form>
    </>
  );
}
