'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { useAuth } from '@/lib/slice';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { auth } = useAuth();

  const status = useMemo(() => {
    if (auth) {
      return 'authenticated';
    }
    return 'unauthenticated';
  }, [auth]);

  if (status === 'unauthenticated') {
    return (
      <div className='flex h-[100vh] items-center justify-center bg-primary text-center md:flex'>
        <h1 className='font-semibold text-primary-foreground md:text-base lg:text-2xl'>
          Please
          <Link
            href='/auth/login'
            className='cursor-pointer px-2 text-primary-foreground underline hover:text-primary-foreground'
          >
            Login
          </Link>
          to View this Page
        </h1>
      </div>
    );
  }

  return (
    <main className='p-4'>
      <section className='min-h-[75vh]'>{children}</section>
    </main>
  );
}
