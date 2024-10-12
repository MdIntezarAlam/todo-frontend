import { AiOutlineEdit } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { cn } from '@/lib/utils/utils';

interface IUpdate {
  open: boolean;
  edit: boolean;
  setValue: () => void;
  setOpen: (open: boolean) => void;
}
export const UpdateIcons = ({ open, setOpen, setValue, edit }: IUpdate) => {
  return (
    <div className={cn(!open && 'bg-black')}>
      {!open && (
        <AiOutlineEdit
          type='button'
          onClick={() => setOpen(true)}
          className='h-10 w-10 rounded-r-md bg-purple-600 p-2 text-white'
        />
      )}
      {open && (
        <div className='flex items-center'>
          <ImCancelCircle
            type='button'
            onClick={() => {
              setValue();
              setOpen(false);
            }}
            className='h-10 w-10 bg-destructive p-3 text-white'
          />
          <button
            type='submit'
            disabled={edit}
            className='flex h-10 w-10 items-center justify-center rounded-r-md bg-green-500'
          >
            <IoIosCheckmarkCircleOutline />
          </button>
        </div>
      )}
    </div>
  );
};
