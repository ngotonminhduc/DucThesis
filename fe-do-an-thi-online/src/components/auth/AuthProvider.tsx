"use client";

import React, { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "react-toastify";

interface AuthProviderProps {
  children: ReactNode;
}

const publicRoutes = ["/auth"];

/**
 * Kiểm tra xem user có role được chỉ định không
 * @param roles - Danh sách roles của user
 * @param roleName - Tên role cần kiểm tra
 */
const hasRole = (roles: any[] = [], roleName: string): boolean => {
  return roles.some((role) => role.name === roleName);
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    isAuthenticated,
    token,
    type,
    checkAuthStatus,
    user,
    error,
    isLoading,
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status on component mount or when token changes
    if (token) {
      checkAuthStatus();
    }
  }, [token, checkAuthStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, type]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const isUnActionAuth = !isAuthenticated && token;
    if (isUnActionAuth) {
      return;
    }
    const isAuth = isAuthenticated && !!token;
    // Check if current route is public
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    const isRootRoute = pathname === "/";
    if (!isAuth && !isPublicRoute) {
      // Not authenticated and trying to access protected route
      router.push("/auth");
    } else if (isAuth && (isPublicRoute || isRootRoute)) {
      if (user?.roles && hasRole(user.roles, "ADMIN")) {
        router.push("/admin/dashboard");
      } else if (user?.roles && hasRole(user.roles, "EDITOR")) {
        router.push("/editor/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, isLoading, user]);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
