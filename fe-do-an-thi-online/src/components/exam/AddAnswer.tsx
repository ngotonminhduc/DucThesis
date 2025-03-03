import { MouseEvent } from "react";

interface AddAnswerProps {
  onClick: () => void;
}

export const AddAnswer = ({ onClick }: AddAnswerProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Thêm câu trả lời"
      className="flex items-start justify-start gap-3 w-1/4 pl-3 pt-4 cursor-pointer"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="rounded-full w-5 h-5 border border-gray-400 pointer-events-none" />
      <div className="w-full pl-2 rounded-b-xl border-b-2 h-6 border-gray-300">
        Thêm câu trả lời
      </div>
    </div>
  );
};
