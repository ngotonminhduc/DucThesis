// components/UserDropdown.tsx
import { FC, useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react'; // Icon user từ lucide-react
import { i } from 'framer-motion/client';
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from 'next/navigation';



const UserDropdown: FC = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle dropdown khi click vào button
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Đóng dropdown khi click ở ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Đóng dropdown khi click ngoài
      }
    };

    // Thêm sự kiện lắng nghe click
    document.addEventListener('click', handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleLogout = () => {
    logout()
    router.replace('/')
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        <User className="text-xl text-gray-600" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-200"
        >
          <ul className="py-2">
            <li>
              <button
                onClick={handleEditProfile}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
