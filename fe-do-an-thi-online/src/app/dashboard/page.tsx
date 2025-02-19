"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // useEffect(() => {
  //   if (localStorage.getItem("isLoggedIn") !== "true") {
  //     router.push("/"); // Nếu chưa đăng nhập, quay lại trang chủ
  //   }
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">🎉 Chào mừng đến Dashboard!</h1>
      <button 
        onClick={() => {
          localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
          router.push("/");
        }} 
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Đăng xuất
      </button>
    </div>
  );
}
