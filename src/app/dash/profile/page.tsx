'use client';
import React from 'react';
import UpdateName from '../_components/UpdateName';
import UpdateEmail from '../_components/UpdateEmail';
import UpdatePassword from '../_components/UpdatePassword';
import { useAuth } from '@/lib/slice';
import DeleteAccount from '../_components/DeleteAccount';

export default function Profile() {
  const { auth } = useAuth();
  return (
    <div className='flex min-h-[55vh] flex-col items-center gap-5 rounded-md border-8 p-5 text-foreground lg:m-20'>
      <div className='flex flex-col items-center gap-2'>
        <div className='h-[10vh] w-[10vh] cursor-pointer rounded-full bg-gray-400/35' />
        <h1 className='text-2xl font-bold'>{auth?.account.name}</h1>
      </div>

      <div className='flex w-full flex-col gap-8'>
        <UpdateName />
        <UpdateEmail />
        <UpdatePassword />
        <DeleteAccount />
      </div>
    </div>
  );
}
