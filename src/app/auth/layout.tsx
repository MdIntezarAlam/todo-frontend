'use client';
import { useAuthStore } from '@/lib/slice/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser: data } = useAuthStore();
  const router = useRouter();
  const status = useMemo(() => {
    if (data) {
      return 'authenticated';
    } else {
      return 'unauthenticated';
    }
  }, [data]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else {
      router.push('/');
    }
  }, [status]);
  return <>{children}</>;
}
