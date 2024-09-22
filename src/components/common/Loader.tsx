'use client';

import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
export default function Loader({
  isLoading,
  onOpenChange,
}: {
  isLoading: boolean;
  onOpenChange?: (val: boolean) => void;
}) {
  return (
    <AlertDialog open={isLoading} onOpenChange={onOpenChange}>
      <AlertDialogContent className='z-[9999] flex items-center justify-center border-none bg-transparent text-center shadow-none'>
        <div className='loader-1' />
      </AlertDialogContent>
    </AlertDialog>
  );
}
