"use client";

import { Button } from "@/components/button/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Xử lý các trường hợp đặc biệt
  if (totalPages <= 1) {
    return null; // Không hiển thị nếu chỉ có 1 trang
  }
  
  // Hàm xử lý chuyển trang trước/sau
  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Giới hạn số nút trang hiển thị để UI gọn hơn
  const getPageNumbers = () => {
    const maxDisplayed = 5;
    
    if (totalPages <= maxDisplayed) {
      // Hiển thị tất cả các trang nếu ít hơn hoặc bằng maxDisplayed
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Tính toán phạm vi trang cần hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayed / 2));
    let endPage = startPage + maxDisplayed - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxDisplayed + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Nút Previous */}
      <Button
        text=""
        customStyle={`px-2 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={goToPrevPage}
        icon={<ChevronLeft size={16} />}
      />
      
      {/* Các nút trang */}
      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          text={pageNum.toString()}
          customStyle={`px-3 py-1 rounded ${
            currentPage === pageNum
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(pageNum)}
        />
      ))}
      
      {/* Nút Next */}
      <Button
        text=""
        customStyle={`px-2 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={goToNextPage}
        icon={<ChevronRight size={16} />}
      />
      
      {/* Hiển thị thông tin trang */}
      <span className="text-xs text-gray-500 ml-2">
        Trang {currentPage}/{totalPages}
      </span>
    </div>
  );
};
