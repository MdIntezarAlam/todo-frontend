'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        retryOnMount: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <main className='mx-auto min-h-[85vh] max-w-[2000px]'>{children}</main>
    </QueryClientProvider>
  );
};
