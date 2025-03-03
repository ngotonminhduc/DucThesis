"use client";
import { CirclePlus } from 'lucide-react';
import { usePathname } from "next/navigation";
interface BottomRightButtonProps {
  onClick?: () => void
}

export const BottomRightButton = ({ onClick }: BottomRightButtonProps) => {
  const pathname = usePathname();

  if (pathname !== "/admin/dashboard") return null; // Chỉ hiển thị ở trang dashboard
  return (
    <div className='fixed right-6 sm:right-6 md:right-20 bottom-9 sm:bottom-9 md:bottom-10 lg:bottom-20 '>
      <button onClick={onClick}>
        <CirclePlus width={40} height={40}/>
      </button>
    </div>
  );
}
