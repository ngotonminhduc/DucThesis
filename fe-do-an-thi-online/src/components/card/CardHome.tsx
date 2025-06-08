import { Status } from "@/utils/type";
import React from "react";
import { formatHumanTime, formatTime } from "@/utils/formatTime";
import { Clock, Trash2, CheckCircle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-500",
  active: "bg-green-600",
  inactive: "bg-red-300",
  completed: "bg-blue-500", // Thêm màu cho trạng thái completed
};

interface CardProps {
  topic: string;
  examId: string;
  description: string;
  status: Status;
  examTime: number;
  isCompleted?: boolean;
  onClick?: () => void;
  onRemoveItem?: () => void;
}

export const CardHome: React.FC<CardProps> = ({
  topic,
  description,
  status,
  examTime,
  isCompleted,
  onClick,
  onRemoveItem,
}) => {
  const sliceTopic = topic.slice(0, 12) + (topic.length > 12 ? "..." : "");

  return (
    <div
      className={`group relative rounded-xl shadow-lg transition-all duration-300 w-full border ${
        isCompleted
          ? "border-gray-200 dark:border-gray-600 cursor-default"
          : "border-gray-100 dark:border-gray-700 hover:border-primary-100 cursor-pointer hover:shadow-xl"
      } bg-white dark:bg-gray-800 overflow-hidden`}
    >
      <div
        onClick={!isCompleted ? onClick : undefined}
        className={`transition-transform ${
          isCompleted ? "opacity-60" : "active:scale-[98%]"
        }`}
      >
        <div className="p-5 pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center">
              <h2
                className={`text-xl font-semibold ${
                  isCompleted
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {sliceTopic}
                <span
                  className={`ml-2.5 inline-block w-2 h-2 rounded-full ${statusColors[status]}`}
                />
              </h2>
              {isCompleted && (
                <CheckCircle className="ml-2 w-5 h-5 text-blue-500" />
              )}
            </div>

            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[status]} text-white`}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <p
            className={`mt-3 text-sm leading-relaxed line-clamp-2 ${
              isCompleted
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 relative group/time">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{formatTime(examTime)}</span>
            <div className="absolute hidden group-hover/time:block bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md whitespace-nowrap dark:bg-gray-700">
              {formatHumanTime(examTime)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 dark:bg-gray-700" />
            </div>
          </div>

          {onRemoveItem && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem();
              }}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Hiển thị hiệu ứng hover chỉ khi không ở trạng thái completed */}
      {!isCompleted && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-100 dark:group-hover:border-primary-400 pointer-events-none rounded-xl transition-all" />
      )}
    </div>
  );
};
