import { useAuthStore } from "@/store/auth-store";

/**
 * Hook để kiểm tra quyền của user hiện tại
 * @returns Object chứa các hàm kiểm tra quyền
 */
export const useRole = () => {
  const { user } = useAuthStore();

  /**
   * Kiểm tra xem user có role được chỉ định không
   * @param roleName - Tên role cần kiểm tra
   */
  const hasRole = (roleName: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some((role) => role.name === roleName);
  };

  /**
   * Kiểm tra xem user có role admin không
   */
  const isAdmin = (): boolean => {
    return hasRole("ADMIN");
  };

  return {
    hasRole,
    isAdmin,
  };
};
