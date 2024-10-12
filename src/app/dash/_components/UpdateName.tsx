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

const nameValidator = z.object({
  name: z.string().min(3, 'Minimum 3 characters').optional(),
});

type TnameType = z.infer<typeof nameValidator>;

export default function UpdateName() {
  const { auth } = useAuth();
  const [name, setName] = useState(false);

  const initialValues = {
    name: auth?.account.name,
  };
  const formHook = useForm<TnameType>({
    defaultValues: initialValues,
    resolver: zodResolver(nameValidator),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TnameType) => {
      const res = await axios.put(
        `${env.AUTH_URL}/update/${auth?.account._id}`,
        val
      );
      setName(false);
      console.log(res.data);
      toast.success('Name updated successfully');
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
          type='text'
          placeholder='Full Name mm'
          label='Full Name'
          minLength={3}
          maxLength={20}
          disabled={!name}
          icon={
            <UpdateIcons
              open={name}
              setOpen={setName}
              setValue={() => formHook.setValue('name', auth?.account.name)}
              edit={formHook.watch('name') === auth?.account?.name}
            />
          }
          {...formHook.register('name')}
        />
      </form>
    </>
  );
}
