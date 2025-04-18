import { TTest } from "@/services/testService";
import { formatHumanTime } from "@/utils/formatTime";
import { roundToOneDecimal } from "@/utils/num";
import { getSecond } from "@/utils/time";
import React from "react";

interface ResultSummaryProps {
  test: TTest;
}
const ResultSummary: React.FC<ResultSummaryProps> = ({ test }) => {
  return (
    <div className="p-6 border-b border-slate-200">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-600">
            Điểm số: {roundToOneDecimal(test.score)}
          </h2>
          <p className="text-gray-600">
            Số câu đúng: {test.correctAnswersCount ?? 0}/
            {Object.keys(test.correctAnswersMap ?? {}).length} (Trắc nghiệm)
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">
            Thời gian làm bài:{" "}
            {formatHumanTime(
              Math.floor(
                getSecond(
                  new Date(test.finalAt).getTime() -
                    new Date(test.startAt).getTime(),
                  "milisecond"
                )
              )
            )}
          </p>
          <p className="text-gray-500">
            Trạng thái: {test.status === "Locked" ? "Đã hoàn thành" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
