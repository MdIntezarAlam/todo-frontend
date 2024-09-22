'use client';
import React, { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import axios from 'axios';

interface ISignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const { watch, register, handleSubmit } = useForm<ISignupForm>();
  console.log(watch('email'));
  console.log(watch('password'));

  const onSubmit: SubmitHandler<ISignupForm> = (data: ISignupForm) => {
    console.log('data: ', data);
    console.log(data);
  };

  const testingApi = async () => {
    try {
      const res = await axios.get(
        // "https://int-next-youtube.netlify.app/.netlify/functions/api/test"
        'https://next-youtube-backend.netlify.app/.netlify/functions/api/users'
      );

      console.log('res: ', res);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    void testingApi();
  }, []);
  return (
    <div className='m-auto flex h-screen w-full flex-col gap-4 bg-primary p-4 text-primary-foreground'>
      <div className='m-auto flex w-full flex-col gap-10 rounded-md border bg-card p-10 lg:w-1/2'>
        <h1 className='border-b pb-4 text-center text-4xl font-medium'>
          Signup
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid place-items-center gap-5'
        >
          <Input placeholder='Name' {...register('name')} />
          <Input placeholder='Email' {...register('email')} />
          <Input placeholder='Password' {...register('password')} />
          <Input
            placeholder='Confirm Password'
            {...register('confirmPassword')}
          />
          <div className='flex w-full items-center gap-2'>
            <hr className='h-0.5 w-full bg-primary' />
            <p className=''>or</p>
            <hr className='h-0.5 w-full bg-primary' />
          </div>
          <div className='space-x-2 text-sm font-normal'>
            <span>Already have an account?</span>
            <a href='/auth/login'>Login</a>{' '}
          </div>
          <button
            type='button'
            className='h-12 w-full rounded-md bg-secondary text-lg font-medium'
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
