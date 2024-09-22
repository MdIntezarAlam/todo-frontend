'use client';
import { Input } from '@/components/ui/input';
import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

interface ISignupForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { watch, register, handleSubmit } = useForm<ISignupForm>();
  console.log(watch('email'));
  console.log(watch('password'));

  const onSubmit: SubmitHandler<ISignupForm> = (data: ISignupForm) => {
    console.log('data: ', data);
    console.log(data);
  };

  return (
    <div className='m-auto flex h-screen w-full flex-col gap-4 bg-primary p-4 text-primary-foreground'>
      <div className='m-auto flex w-full flex-col gap-10 rounded-md border bg-card p-10 lg:w-1/2'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-4xl font-medium'>Login</h1>
          <h1 className='text-2xl font-medium'>
            Welcome back to your account !
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid place-items-center gap-5'
        >
          <Input placeholder='Email' {...register('email')} />
          <Input placeholder='Password' {...register('password')} />

          <div className='flex w-full items-center gap-2'>
            <hr className='h-0.5 w-full bg-primary' />
            <p className=''>or</p>
            <hr className='h-0.5 w-full bg-primary' />
          </div>
          <div className='space-x-2 text-sm font-normal'>
            <span>Already have an account?</span>
            <a href='/auth/signup'>Signup</a>{' '}
          </div>
          <button className='h-12 w-full rounded-md bg-secondary text-lg font-medium'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
