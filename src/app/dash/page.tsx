'use client';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/slice/useAuth';
import { useRouter } from 'next/navigation';
/* eslint-disable react/jsx-key */

import React from 'react';

export default function Dashboard() {
  const { currentUser } = useAuthStore();
  const Router = useRouter();
  const dashItems = [
    {
      name: 'Add To Do',
      icon: '/images/dash.png',
      path: '/dash/todo',
    },
    {
      name: 'My Profile',
      icon: '/images/dash.png',
      path: '/dash/profile',
    },
    {
      name: 'My Address',
      icon: '/images/dash.png',
      path: '/dash/address',
    },
    {
      name: 'Comming Soon',
      icon: '/images/dash.png',
      path: '/das',
    },
  ];
  return (
    <section className='mx-auto min-h-[90vh] w-fit justify-center pt-3 xl:flex xl:justify-start'>
      <h1 className='mb-2 text-2xl font-bold capitalize md:text-start lg:text-start'>
        {currentUser?.account.name
          ? `Welcome ${currentUser?.account.name}`
          : null}
      </h1>
      <div className='grid grid-cols-2 gap-5 p-5 md:grid-cols-3 lg:grid-cols-4'>
        {dashItems.map((item, index) => (
          <div
            onClick={() => Router.push(item.path)}
            key={index}
            className='relative flex h-[250px] w-[250px] items-center justify-center'
          >
            <img
              src={item.icon}
              alt='dashboard'
              className='h-full w-full rounded-md'
            />
            <Button className='absolute inset-0 m-auto w-1/2 rounded-full'>
              {item.name}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
