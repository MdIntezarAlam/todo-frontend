'use client';
import { useAuth } from '@/lib/slice';
import Link from 'next/link';
import React from 'react';
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { MdAccountCircle, MdDashboard } from 'react-icons/md';
import { LuUserCircle } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { auth } = useAuth();
  const dropItem = [
    {
      label: 'My Dashboard',
      href: '/dash',
      icon: <MdDashboard className='text-lg' />,
    },
    {
      label: 'My Profile',
      href: '/dash/profile',
      icon: <MdAccountCircle className='text-xl' />,
    },
    {
      label: 'My Addresse',
      href: '/dash/address',
      icon: <MdAccountCircle className='text-xl' />,
    },
  ];
  return (
    <div className='sticky top-0 z-50 flex w-full items-center justify-between bg-background p-4 text-foreground shadow-xl'>
      <h1 className='text-xl font-bold'>Daily Basis Managment Applicaion</h1>
      {!auth ? (
        <Link href={'/auth/login'}>Login</Link>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type='button'>
                <LuUserCircle className='rounded-full bg-black p-1 text-3xl text-white' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='mr-1'>
              <DropdownMenuGroup>
                {dropItem.map((item) => (
                  <DropdownMenuItem asChild key={item.label} className='px-2'>
                    <Link
                      href={item.href}
                      className='flex cursor-pointer items-center gap-x-3'
                    >
                      {item.icon}
                      <span className='text-xs'>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
