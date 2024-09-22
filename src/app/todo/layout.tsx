'use client';
import React from 'react';
import ViewTodo from './_components/ViewTodo';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-2 gap-4 bg-primary p-4 text-popover-foreground'>
      <div>{children}</div>
      <ViewTodo />
    </div>
  );
}
