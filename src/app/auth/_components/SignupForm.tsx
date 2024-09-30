/* eslint-disable react/no-unescaped-entities */
'use client';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/slice/useAuth';
import { useDebounce } from '@/lib/slice/useDebounce';
import { env } from '@/lib/utils/configs/env';
import { getErrorMessage } from '@/lib/utils/handler';
import { type TAccount } from '@/types/TUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    conPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine(
    (val) => {
      if (val.password !== val.conPassword) {
        return false;
      } else {
        return true;
      }
    },
    { message: 'Password and Confirm Password should be same' }
  );

type signupValidator = z.infer<typeof signupSchema>;

const LoginForm = () => {
  const Router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { setCurrentUser } = useAuthStore();

  const signupHooks = useForm<signupValidator>({
    defaultValues: undefined,
    resolver: zodResolver(signupSchema),
  });

  // before signup check is email already exist
  const email = useDebounce(signupHooks.watch('email'), 500);

  useEffect(() => {
    async function checkEmail() {
      setIsEmailValid(false);
      if (!z.string().email().safeParse(email).success) {
        return;
      }
      try {
        const { data }: { data: { data: { isAccountExists: boolean } } } =
          await axios.post(`${env.AUTH_URL}/email`, { email });
        console.log(data);
        if (data.data.isAccountExists) {
          setEmailError();
        } else {
          setIsEmailValid(true);
          signupHooks.clearErrors('email');
        }
      } catch (error) {
        setEmailError();
      }
    }
    void checkEmail();

    function setEmailError() {
      signupHooks.setError('email', {
        type: 'custom',
        message: 'Email is already taken',
      });
    }
  }, [email]);

  const onSubmit = useMutation({
    mutationFn: async (val: signupValidator) => {
      if (!isEmailValid) {
        toast.error('Email is already taken');
        return;
      }
      const res = await axios.post(`${env.AUTH_URL}/signup`, val);
      toast.success('Account created successfully');
      Router.push('/auth/login');
      setCurrentUser(res.data as TAccount);
      return res.data;
    },
    onError: (error) => {
      console.log('error', error);
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <div className='m-auto flex h-screen w-full flex-col gap-4 bg-primary p-4 text-black'>
      <div className='m-auto flex w-full flex-col gap-10 rounded-md border bg-secondary p-10 lg:w-1/2'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-4xl font-medium'>Signup</h1>
          <h1 className='text-2xl font-medium'>
            Welcome back to your account !
          </h1>
        </div>
        <Loader isLoading={onSubmit.isPending} />

        <form
          onSubmit={signupHooks.handleSubmit((val) => {
            onSubmit.mutate(val);
          })}
          className='flex w-full flex-col gap-6'
        >
          <Input
            placeholder='name'
            {...signupHooks.register('name')}
            error={signupHooks.formState.errors.name?.message}
            className='!w-full'
            type='name'
          />
          <Input
            placeholder='Email'
            {...signupHooks.register('email')}
            error={signupHooks.formState.errors.email?.message}
            className='!w-full'
            type='email'
          />
          <Input
            placeholder='Password'
            {...signupHooks.register('password')}
            error={signupHooks.formState.errors.password?.message}
            className='!w-full'
            type='password'
          />
          <Input
            placeholder='confirm password'
            {...signupHooks.register('conPassword')}
            error={signupHooks.formState.errors.conPassword?.message}
            className='!w-full'
            type='password'
          />

          <div className='flex w-full items-center gap-2'>
            <hr className='h-0.5 w-full bg-primary' />
            <p className=''>or</p>
            <hr className='h-0.5 w-full bg-primary' />
          </div>
          <div className='space-x-2 text-sm font-normal'>
            <span>Don't have an account?</span>
            <a href='/auth/signup'>Login</a>{' '}
          </div>
          <Button type='submit' className='h-12 w-full rounded-full'>
            Signup
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
