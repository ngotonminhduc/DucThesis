import React from "react";
import { format, formatDistance } from "date-fns";
import { Clock, Trash2 } from "lucide-react";
import { vi } from "date-fns/locale"; // Sử dụng locale tiếng Việt
import { roundToOneDecimal } from "@/utils/num";

const scoreColors = {
  good: "bg-green-500",
  medium: "bg-yellow-500",
  poor: "bg-red-500",
};

interface TestCardProps {
  topic: string;
  description: string;
  startTime: Date;
  endTime: Date;
  score: number;
  onClick?: () => void;
  onRemoveItem?: () => void;
}

const TestCard: React.FC<TestCardProps> = ({
  topic,
  description,
  startTime,
  endTime,
  score,
  onClick,
  onRemoveItem,
}) => {
  const sliceTopic = topic.slice(0, 12) + (topic.length > 12 ? "..." : "");
  const getScoreColor = (score: number) => {
    if (score >= 8) return scoreColors.good;
    if (score >= 5) return scoreColors.medium;
    return scoreColors.poor;
  };

  return (
    <div className="group relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full border border-gray-100 dark:border-gray-700 hover:border-primary-100 bg-white dark:bg-gray-800 overflow-hidden">
      <div
        onClick={onClick}
        className="cursor-pointer active:scale-[98%] transition-transform"
      >
        <div className="p-5 pb-3">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {sliceTopic}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {roundToOneDecimal(score)}/10
              </span>
              <span
                className={`w-3 h-3 rounded-full ${getScoreColor(score)}`}
              />
            </div>
          </div>

          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 relative group/time">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>
              {format(startTime, "dd/MM/yy HH:mm")} -{" "}
              {format(endTime, "dd/MM/yy HH:mm")}
            </span>

            <div className="absolute hidden group-hover/time:block bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md whitespace-nowrap dark:bg-gray-700">
              <div>Bắt đầu: {format(startTime, "HH:mm dd/MM/yyyy")}</div>
              <div>Kết thúc: {format(endTime, "HH:mm dd/MM/yyyy")}</div>
              <div>
                Thời gian làm bài:{" "}
                {formatDistance(endTime, startTime, { locale: vi })}
              </div>
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
              title="Xóa lịch sử"
            >
              <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Hover effect layer */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-100 dark:group-hover:border-primary-400 pointer-events-none rounded-xl transition-all" />
    </div>
  );
};

export default TestCard
