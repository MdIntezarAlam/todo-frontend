/* eslint-disable @typescript-eslint/no-unsafe-argument */

'use client';
import React, { useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { useTodoStore } from '@/lib/slice/userTodo';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type ITodoValues = z.infer<typeof todoSchema>;

interface IProps {
  id: string;
}
export default function EditTodos({ id }: IProps) {
  const router = useRouter();
  const { currentTodo, setCurrentTodo } = useTodoStore((s) => s);
  const queryClient = useQueryClient();

  const getSingleTodo = async (id: string) => {
    try {
      const res = await axios.get(`${env.TODO_URL}/fetch/${id}`);
      return res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!currentTodo) {
      void getSingleTodo(id);
    }
  }, [id, currentTodo, setCurrentTodo]);

  const todoForm = useForm<ITodoValues>({
    defaultValues: {
      title: currentTodo?.title,
      description: currentTodo?.description,
    },
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: ITodoValues) => {
      const res = await axios.put(`${env.TODO_URL}/edit/${id}`, val);
      toast.success(res.data.message);
      console.log('res: ', res);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
        exact: true,
      });
      todoForm.reset();
      router.push('/todo');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!currentTodo) {
      router.push('/todo');
    }
  }, [currentTodo, router]);
  return (
    <div className='flex min-h-[70vh] flex-col gap-4 rounded-xl bg-card p-4'>
      <Loader isLoading={onSubmit.isPending} />
      <h1 className='text-center text-4xl font-medium'>Edit To Do</h1>
      {currentTodo && (
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

          <button className='h-12 w-full rounded-md bg-black text-lg font-medium text-white'>
            Update Todo
          </button>
        </form>
      )}
    </div>
  );
}
