'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/slice';
import { getErrorMessage } from '@/lib/utils/handler';
import { type TAccount } from '@/types/TUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(3, 'Email is required'),
  password: z.string().min(8, 'Password is required'),
});
export type loginValidator = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { setAuth } = useAuth();

  const loginFormHooks = useForm<loginValidator>({
    defaultValues: undefined,
    resolver: zodResolver(loginSchema),
  });

  // const onSubmit = useMutation({
  //   mutationFn: async (val: loginValidator) => {
  //     const res = await axios.post(`https://dev-intezar-todo-in.onrender.com/api/v2/auth/login`, val, {
  //       withCredentials: true,

  //     });
  //     // console.log(res.data);
  //     setAuth(res.data as TAccount);
  //     toast.success('Login successfully');
  //     router.push('/');
  //     return res.data;
  //   },
  //   onError: (error) => {
  //     toast.error(getErrorMessage(`${error} err and dont know why`));
  //   },
  // });
  const onSubmit = useMutation({
    mutationFn: async (val: loginValidator) => {
      try {
        const res = await axios.post(
          'https://dev-intezar-todo-in.onrender.com/api/v2/auth/login',
          val,
          {
            withCredentials: true, // Ensure credentials are included
          }
        );
        // Assuming res.data contains the account details
        setAuth(res.data as TAccount); // Store the account data in your auth context or state
        toast.success('Login successful');
        router.push('/'); // Redirect to home or dashboard
        return res.data;
      } catch (error) {
        console.log("Error while logging in:", error);
        toast.error(getErrorMessage(`${error} err and dont know why`));
      }
    },
    onError: (error) => {
      // Customize error handling if needed, like logging or alerting
      toast.error(getErrorMessage(`${error} err and don't know why`));
    },
  });

  return (
    <div className='m-auto mt-4 flex min-h-[50vh] flex-col gap-4 rounded-lg border bg-background p-4 shadow-lg lg:w-1/2'>
      <div className='m-auto flex min-w-full flex-col gap-10 rounded-md border-2 p-5'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-4xl font-medium'>Login</h1>
          <h1 className='text-2xl font-medium'>
            Welcome back to your account !
          </h1>
        </div>
        <form
          onSubmit={loginFormHooks.handleSubmit((val) => {
            onSubmit.mutate(val);
          })}
          className='flex w-full flex-col gap-6'
        >
          <Input
            placeholder='Email'
            {...loginFormHooks.register('email')}
            error={loginFormHooks.formState.errors.email?.message}
            className='!w-full'
            type='email'
          />
          <Input
            placeholder='Password'
            {...loginFormHooks.register('password')}
            error={loginFormHooks.formState.errors.password?.message}
            className='!w-full'
            type='password'
          />

          <div className='flex w-full items-center gap-2'>
            <hr className='h-0.5 w-full bg-primary' />
            <p className=''>or</p>
            <hr className='h-0.5 w-full bg-primary' />
          </div>
          <div className='space-x-2 text-center text-sm font-normal'>
            <span>Already have an account?</span>
            <a href='/auth/signup'>Signup</a>{' '}
          </div>
          <Button className='h-12 w-full rounded-full'>Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
