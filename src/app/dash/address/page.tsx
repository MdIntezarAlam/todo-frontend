'use client';
import React, { useEffect, useState } from 'react';
import { useAddress } from '../_components/useAddress';
import { type IAddress } from '@/types/TAddress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import CreateAddress from '../_components/CreateAddress';

export default function Address() {
  const { address } = useAddress();
  const [addressForm, setAddresses] = useState<IAddress>([]);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    if (address.data) {
      setAddresses(address.data);
    }
  }, [address.data]);

  if (address.isLoading) {
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
      {showAddress && (
        <CreateAddress
          showAddress={showAddress}
          setShowAddress={setShowAddress}
          setAddresses={setAddresses}
        />
      )}
      {addressForm.length > 0 ? (
        <div className='grid grid-cols-3 gap-2'>
          {addressForm?.map((item) => (
            <AddressCard
              key={item._id}
              addressData={item}
              setAddresses={setAddresses}
            />
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

interface ICard {
  addressData: IAddress[0];
  setAddresses: React.Dispatch<React.SetStateAction<IAddress>>;
}
function AddressCard({ addressData, setAddresses }: ICard) {
  return (
    <div className='flex w-full flex-col gap-2 rounded-md border bg-card/50 p-4 text-black shadow'>
      <h1 className='text-2xl font-medium'>{addressData.name}</h1>
      <div className='flex gap-1 font-semibold'>
        Name : <span className='font-medium'>{addressData.name}</span>
      </div>
      <div className='flex gap-1 font-semibold'>
        Contact Name :{' '}
        <span className='font-medium'>{addressData.contactName}</span>
      </div>
      <div className='flex w-full flex-col gap-1 font-semibold'>
        Address :{' '}
        <span className='font-medium'>
          {addressData.address}, {addressData.street1}, {addressData.street2},{' '}
          {addressData.city},{addressData.state},{addressData.country},
          {addressData.pincode}
        </span>
      </div>

      <div className='mt-5 flex items-center justify-start gap-4'>
        <Button variant={'default'} className='!rounnded-md !w-1/3'>
          Edit
        </Button>
        <Button variant={'destructive'} className='!rounnded-md !w-1/3'>
          Delete
        </Button>
      </div>
    </div>
  );
}
