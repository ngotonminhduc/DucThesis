// components/UserDropdown.tsx
import { FC, useState, useEffect, useRef } from "react";
import { User, UserCircle } from "lucide-react"; // Icon user từ lucide-react
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { RoleName } from "@/services/authService";
import { createPortal } from "react-dom";

const UserDropdown: FC = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Khi mở dropdown, tính toán vị trí tuyệt đối của button để đặt dropdown đúng vị trí
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.right - 160 + window.scrollX, // 160 = width dropdown
        zIndex: 9999,
        width: 160,
      });
    }
  }, [isOpen]);

  const handleProfile = () => {
    //TODO
  };

  const handleListTest = () => {
    router.push("/result");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
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

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white shadow-md rounded-md border border-gray-200"
        >
          <ul className="py-2">
            <li>
              <button
                onClick={handleProfile}
                className="w-full flex items-center justify-start gap-2 px-4 py-2 text-gray-700"
              >
                <UserCircle className="w-10 h-10 text-gray-500" />
                {user?.name || "User"}
              </button>
            </li>
            <hr />
            {!user?.roles.some((r) => r.name === RoleName.EDITOR) && (
              <li>
                <button
                  onClick={handleListTest}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Lịch sử thi
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cá nhân
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserDropdown;
