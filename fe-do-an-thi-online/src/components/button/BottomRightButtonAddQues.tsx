"use client";
import { CirclePlus } from 'lucide-react';
import { usePathname } from "next/navigation";
interface BottomRightButtonAddQuesProps {
  onClick?: () => void
  className?: string
}

export const BottomRightButtonAddQues = ({ onClick,className }: BottomRightButtonAddQuesProps) => {
  return (
    // <div className='fixed bottom-20 right-32 flex justify-center items-center'>
      <button type='button' className={`fixed bottom-20 right-32 flex justify-center items-center ${className}`} onClick={onClick}>
        <CirclePlus width={40} height={40}/>
      </button>
    // </div>
  );
}
