import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddressStore } from '../slice';
import { useQuery } from '@tanstack/react-query';
import { env } from '../utils/configs/env';
import axios from 'axios';

export const addressValidator = z.object({
  name: z.string().min(1, 'Name is required'),
  contactName: z.string().min(1, 'Contact Name is required'),
  address: z.string().min(1, 'Address is required'),
  street1: z.string().min(1, 'Street 1 is required'),
  street2: z.string().min(1, 'Street 2 is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pincode: z.coerce.number().min(6, 'minimum 6 and maximum 6 digits'),
});
export type TypeAddress = z.infer<typeof addressValidator>;

const useAddressHooks = () => {
  const { addressData } = useAddressStore();

  const { data } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await axios.get(
        `${env.BACKEND_URL}/address/${addressData?._id}`
      );
      return res.data.data;
    },
  });

  console.log(data);

  const addressForm = useForm<TypeAddress>({
    defaultValues: {
      name: addressData?.name ?? '',
      contactName: addressData?.contactName ?? '',
      address: addressData?.address ?? '',
      street1: addressData?.street1 ?? '',
      street2: addressData?.street2 ?? '',
      city: addressData?.city ?? '',
      state: addressData?.state ?? '',
      country: addressData?.country ?? '',
      pincode: addressData?.pincode,
    },
    resolver: zodResolver(addressValidator),
  });
  return {
    addressForm,
  };
};
export default useAddressHooks;
