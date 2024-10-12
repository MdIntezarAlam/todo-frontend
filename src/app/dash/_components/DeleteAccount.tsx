import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/lib/slice';
import { env } from '@/lib/utils/configs/env';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/handler';
import { useRouter } from 'next/navigation';

const Tvalidator = z.object({
  password: z.string().min(8, 'Password is required'),
  deleteType: z.string().min(8, 'Type is required'),
});

type TDeleteAccount = z.infer<typeof Tvalidator>;

export default function DeleteAccount() {
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  const formHook = useForm<TDeleteAccount>({
    defaultValues: undefined,
    resolver: zodResolver(Tvalidator),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TDeleteAccount) => {
      console.log(val);
      const res = await axios.delete(
        `${env.AUTH_URL}/delete/${auth?.account?._id}`,
        {
          data: val,
          withCredentials: true,
        }
      );
      console.log(res.data);
      setAuth(null);
      toast.success('Account deleted successfully');
      router.push('/auth/login');
    },
    onError: (error) => {
      console.log('error', error);
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          type='button'
          size={'sm'}
          className='h-10 w-1/2 rounded-md text-sm lg:w-1/4'
        >
          Delete My Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-11/12 rounded-md'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className='flex flex-col gap-6'>
            <form
              onSubmit={formHook.handleSubmit((val) => {
                console.log(val);
                onSubmit.mutate(val);
              })}
            >
              <h1>
                * We understand that you may wish to delete your account. Please
                take a moment to consider the following:
              </h1>
              <p>
                * Account deletion is irreversible. All your account data,
                including order history and saved information, will be
                permanently erased.
              </p>
              <div className='flex flex-col gap-7'>
                <Input
                  type='password'
                  label='Enter Password'
                  placeholder='Enter your password'
                  {...formHook.register('password')}
                  error={formHook?.formState?.errors?.password?.message}
                />
                <Input
                  type='text'
                  label="Type 'DELETE_MY_ACCOUNT'"
                  placeholder='Enter DELETE_MY_ACCOUNT'
                  {...formHook.register('deleteType')}
                  error={formHook.formState.errors.deleteType?.message}
                />
              </div>
              <div className='mt-4 flex justify-end gap-4'>
                <AlertDialogCancel className='bg-destructive text-white'>
                  Cancel
                </AlertDialogCancel>
                <Button className='bg-black text-white' type='submit'>
                  Delete
                </Button>
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
