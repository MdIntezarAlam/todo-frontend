import { useAuthStore } from '@/lib/slice/useAuth';
import { env } from '@/lib/utils/configs/env';
import { type IAddress } from '@/types/TAddress';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAddress = () => {
  const { currentUser: data } = useAuthStore();

  const address = useQuery({
    queryKey: ['address'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/address/fetch`);
      return res.data.data as IAddress;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!data,
  });
  return { address };
};
