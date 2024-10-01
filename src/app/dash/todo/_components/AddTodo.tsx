/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import { toast } from 'sonner';
import { env } from '@/lib/utils/configs/env';
import Loader from '@/components/common/Loader';
import { getErrorMessage } from '@/lib/utils/handler';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type ITodoValues = z.infer<typeof todoSchema>;

export default function AddToDo() {
  const queryClient = useQueryClient();

  const todoForm = useForm<ITodoValues>({
    defaultValues: undefined,
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: ITodoValues) => {
      const res = await axios.post(`${env.BACKEND_URL}/create`, val);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
        exact: true,
      });
      todoForm.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <div className='flex min-h-[70vh] flex-col gap-4 rounded-xl bg-card p-4'>
      <Loader isLoading={onSubmit.isPending} />
      <h1 className='text-center text-4xl font-medium'>Add To Do</h1>
      <form
        className='grid w-full gap-10'
        onSubmit={todoForm.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
      >
        <Input
          label='Enter Title of Todo'
          placeholder='Enter Title of Todo'
          {...todoForm.register('title')}
          error={todoForm.formState.errors.title?.message}
        />
        <Input
          label='Enter Description of Todo'
          placeholder='Enter Description of Todo'
          {...todoForm.register('description')}
          error={todoForm.formState.errors.description?.message}
        />

        <button className='h-12 w-full rounded-full bg-black text-lg font-medium text-white'>
          Add Todo
        </button>
      </form>
    </div>
  );
}
