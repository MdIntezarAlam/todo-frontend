'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/slice';
import { useRouter } from 'next/navigation';

import React from 'react';

export default function Dashboard() {
  const { auth } = useAuth();
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
      path: '/dash',
    },
  ];
  return (
    <section className='mx-auto flex min-h-[90vh] w-fit flex-col justify-center overflow-hidden pt-3 xl:flex xl:justify-start'>
      <h1 className='mb-2 text-2xl font-bold capitalize md:text-start lg:text-start'>
        {auth?.account.name ? `Welcome ${auth?.account.name}` : null}
      </h1>
      <div className='grid grid-cols-2 gap-5 p-5 md:grid-cols-3 lg:grid-cols-4'>
        {dashItems.map((item, index) => (
          <div
            onClick={() => Router.push(item.path)}
            key={index}
            className='relative flex h-[170px] w-[170px] items-center justify-center lg:h-[250px] lg:w-[250px]'
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
