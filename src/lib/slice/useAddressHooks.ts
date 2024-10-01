import { z } from 'zod';
// import { stateValues } from '../constant/state';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const addressForm = useForm<TypeAddress>({
    defaultValues: undefined,
    resolver: zodResolver(addressValidator),
  });
  return {
    addressForm,
  };
};
export default useAddressHooks;
