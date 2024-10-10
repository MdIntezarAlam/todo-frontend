/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { env } from '@/lib/utils/configs/env';
import { type TypesTodo } from '@/types/todoTypes';
import { useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/handler';
import { MdDeleteSweep } from 'react-icons/md';
import { GrEdit } from 'react-icons/gr';
import { useRouter } from 'next/navigation';
import { useTodo } from '@/lib/slice';
import Loader from '@/components/common/Loader';

export default function ViewTodo() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setCurrentTodo } = useTodo();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data, isLoading, isError } = useQuery<TypesTodo['data']>({
    queryKey: ['todos'],
    queryFn: async () => {
      const data = await axios.get(`${env.BACKEND_URL}/fetch`);
      const res = data.data.data;
      return res;
    },
  });

  const deleteSingleTodo = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${env.BACKEND_URL}/delete/${id}`);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
        exact: true,
      });
    },
    onError: async (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  const deleteAllTodo = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${env.BACKEND_URL}/delete`);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
        exact: true,
      });
    },
    onError: async (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (isLoading) return <Loader isLoading={isLoading} />;
  if (isError) return <p>Error</p>;

  const totalItems = data?.length ?? 0;
  const totalPage = Math.ceil(totalItems / itemsPerPage);
  const sortedData = data?.sort((a, b) => (a._id < b._id ? 1 : -1));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const editTodo = async (id: string) => {
    const selectedTodo = data?.find((todo) => todo._id === id);

    if (!selectedTodo) {
      toast.error('Todo not found');
      return;
    }
    setCurrentTodo(selectedTodo);
    router.push(`/dash/todo/edit/${id}`);
  };

  return (
    <div className='flex-col rounded-xl bg-card p-4'>
      <h1 className='mt-4 text-center text-4xl font-medium'>View To Do</h1>
      {!currentItems?.length ? (
        <div className='m-auto -mt-10 flex h-full w-1/3 items-center text-center text-xl font-bold'>
          Currently Data Not Found!
        </div>
      ) : (
        <>
          <button
            onClick={() => deleteAllTodo.mutate()}
            className='float-right mb-4 w-fit rounded-full bg-destructive px-10 py-2 text-white'
          >
            Delete All
          </button>
          {currentItems?.map((todo) => (
            <div
              key={todo._id}
              className='relative my-2 grid w-full gap-2 rounded-md border-2 p-4 shadow-xl'
            >
              <h1>
                <strong>Title:</strong> {todo.title}
              </h1>
              <h1>
                <strong>Description:</strong> {todo.description}
              </h1>
              <div className='absolute -right-2 -top-1 flex cursor-pointer items-center gap-2'>
                <GrEdit
                  onClick={async () => await editTodo(todo._id)}
                  className='rounded-full bg-green-500 p-1 text-xl text-white'
                />
                <MdDeleteSweep
                  onClick={() => deleteSingleTodo.mutate(todo._id)}
                  className='text-xl text-destructive'
                />
              </div>
            </div>
          ))}

          {totalPage > 1 && (
            <div className='mt-6 flex justify-center gap-4'>
              <button
                className={`rounded border px-4 py-2 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className='px-4 py-2'>{`Page ${currentPage} of ${totalPage}`}</span>
              <button
                className={`rounded border px-4 py-2 ${currentPage === totalPage ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={nextPage}
                disabled={currentPage === totalPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
