import React from 'react';

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { stateValues } from '@/lib/constant/state';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import useAddressHooks from '@/lib/hooks/useAddressHooks';
import { env } from '@/lib/utils/configs/env';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/handler';
import { useAddressStore } from '@/lib/slice';
import { type TAddresses } from '@/types/TAddress';

export interface IAddress {
  name: string;
  contactName: string;
  address: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
}

interface ICreate {
  showAddress: boolean;
  setShowAddress: (showAddress: boolean) => void;
}

export default function CreateAddress({
  showAddress,
  setShowAddress,
}: ICreate) {
  const { addressForm } = useAddressHooks();
  const queryClient = useQueryClient();
  const { setAddresses } = useAddressStore();

  const onSubmit = useMutation({
    mutationFn: async (values: IAddress) => {
      const res = await axios.post(`${env.BACKEND_URL}/address/create`, values);
      setAddresses(res.data.data as TAddresses);
      setShowAddress(false);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['addresses'],
        exact: true,
      });
      addressForm.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <Dialog open={showAddress} onOpenChange={setShowAddress}>
      <DialogContent className='rounded-md sm:max-w-[40rem]'>
        <DialogHeader>
          <h1 className='text-start text-xl font-bold'>Create Address</h1>
        </DialogHeader>
        <form
          onSubmit={addressForm.handleSubmit((data) => {
            console.log('submitted data', data);
            onSubmit.mutate(data);
          })}
          className='flex flex-col gap-5'
        >
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              label='Name'
              placeholder='name'
              {...addressForm.register('name')}
              error={addressForm.formState.errors.name?.message}
            />
            <Input
              type='text'
              label='Contact Name'
              placeholder='Contact Name'
              {...addressForm.register('contactName')}
              error={addressForm.formState.errors.contactName?.message}
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              label='Address'
              placeholder='Address'
              {...addressForm.register('address')}
              error={addressForm.formState.errors.address?.message}
            />
            <Input
              type='text'
              label='Strre1'
              placeholder='Strre1'
              {...addressForm.register('street1')}
              error={addressForm.formState.errors.street1?.message}
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              label='Stree2'
              placeholder='Stree2'
              {...addressForm.register('street2')}
              error={addressForm.formState.errors.street2?.message}
            />
            <Input
              type='number'
              label='Pincode'
              placeholder='Pincode'
              {...addressForm.register('pincode')}
              error={addressForm.formState.errors.pincode?.message}
            />
          </div>
          <div className='grid grid-cols-1'>
            <Input
              type='text'
              label='City'
              placeholder='City'
              {...addressForm.register('city')}
              error={addressForm.formState.errors.city?.message}
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Select
              onValueChange={(val) => {
                addressForm.setValue('state', val);
              }}
              defaultValue={addressForm.getValues('state') ?? ''}
            >
              <SelectTrigger
                error={addressForm.formState.errors.state?.message}
              >
                <SelectValue placeholder='Select State' />
              </SelectTrigger>
              <SelectContent>
                {stateValues.map((states) => (
                  <SelectItem key={states} value={states}>
                    {states}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) => addressForm.setValue('country', val)}
            >
              <SelectTrigger
                error={addressForm.formState.errors.country?.message}
              >
                <SelectValue placeholder='Country' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='India'>India</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className='mt-2 flex w-full items-end'>
            <Button type='submit'>Create Address</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
