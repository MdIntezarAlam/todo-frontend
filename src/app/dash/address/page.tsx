/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import React, { useState } from 'react';
import { type TAddress } from '@/types/TAddress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import CreateAddress from '../_components/CreateAddress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { env } from '@/lib/utils/configs/env';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/handler';

import { useAddressStore } from '@/lib/slice';
import EditAddress from '../_components/EditAddress';
import ConfirmDialog from '@/app/_components/ConfrmDialoge';

export default function Address() {
  const [showAddress, setShowAddress] = useState(false);
  const { setAddresses } = useAddressStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TAddress['address']>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/address/fetch`);
      setAddresses(res.data.data);
      return res.data.data;
    },
  });

  const deleteAll = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`${env.BACKEND_URL}/address/delete`);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: async () => {
      queryClient.setQueryData<TAddress['address']>(['addresses'], () => []);
      await queryClient.invalidateQueries({
        queryKey: ['addresses'],
        exact: true,
      });
    },
    onError: async (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (isLoading) {
    return (
      <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-60 w-full animate-pulse rounded-md bg-muted'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 p-5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h1>My Address</h1>
          <Button
            variant={'outline'}
            className='rounded-md !text-lg'
            onClick={() => setShowAddress(true)}
          >
            Add New Address
          </Button>
        </div>
        {data && data.length > 0 && (
          <ConfirmDialog title='Delete All' action={() => deleteAll.mutate()} />
        )}

        {showAddress && (
          <CreateAddress
            showAddress={showAddress}
            setShowAddress={setShowAddress}
          />
        )}
      </div>

      {data && data.length > 0 ? (
        <div className='grid grid-cols-3 gap-2'>
          {data.map((item) => (
            <AddressCard key={item._id} {...item} />
          ))}
        </div>
      ) : (
        <div className='flex w-full items-center justify-center border shadow-sm'>
          <div className='flex h-full min-h-[50vh] flex-col items-center justify-center py-6'>
            <hr className='text-muted-foreground' />
            <h1 className='mt-8 font-semibold md:text-2xl'>
              No addresses found
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              You have not added any addresses yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AddressCard(props: TAddress['address'][0]) {
  const {
    _id,
    address,
    name,
    contactName,
    street1,
    street2,
    city,
    state,
    country,
    pincode,
  } = props;
  const queryClient = useQueryClient();
  const [editAddress, setEditAddress] = useState(false);

  const deleteSingleAddress = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${env.BACKEND_URL}/address/delete/${id}`);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: async (_, id) => {
      queryClient.setQueryData<TAddress['address']>(['addresses'], (oldData) =>
        oldData?.filter((address) => address._id !== id)
      );
      await queryClient.invalidateQueries({
        queryKey: ['addresses'],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <div className='flex w-full flex-col gap-2 rounded-md border bg-card/50 p-4 text-black shadow'>
      <h1 className='text-2xl font-medium'>{name}</h1>
      <div className='flex gap-1 font-semibold'>
        Name: <span className='font-medium'>{name}</span>
      </div>
      <div className='flex gap-1 font-semibold'>
        Contact Name: <span className='font-medium'>{contactName}</span>
      </div>
      <div className='flex w-full flex-col gap-1 font-semibold'>
        Address:
        <span className='font-medium'>
          {address}, {street1}, {street2}, {city}, {state}, {country}, {pincode}
        </span>
      </div>

      <div className='mt-5 flex items-center justify-start gap-4'>
        <Button
          onClick={() => setEditAddress(true)}
          variant='default'
          className='w-1/3 rounded-md'
        >
          Edit
        </Button>
        {editAddress && (
          <EditAddress
            showAddress={editAddress}
            setShowAddress={setEditAddress}
            data={props}
          />
        )}
        <ConfirmDialog
          title='Delete'
          action={() => deleteSingleAddress.mutate(_id)}
        />
      </div>
    </div>
  );
}
