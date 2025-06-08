import React, { MouseEventHandler } from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../button/Button";
import { useAuthStore } from "@/store/auth-store";

interface EmptyExamStateProps {
  onCreateExam: MouseEventHandler<HTMLButtonElement>;
}

const EmptyExamState = ({ onCreateExam }: EmptyExamStateProps) => {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        Chưa có đề thi nào
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {user?.isAdmin
          ? "Bạn chưa tạo đề thi nào. Hãy tạo đề thi đầu tiên để bắt đầu."
          : "Hãy đợi giáo viên tạo đề thi"}
      </p>
      {user?.isAdmin && (
        <Button
          onClick={onCreateExam}
          text="Tạo đề thi mới"
          customStyle="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        />
      )}
    </div>
  );
};

export default EmptyExamState;
