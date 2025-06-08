import { TExam } from "@/services/examService";
import { formatHumanTime, formatTime } from "@/utils/formatTime";
import { CheckCircleIcon } from "lucide-react";
import React from "react";

interface TestExamHeaderProps {
  exam?: TExam;
  timeLeft?: number;
  code: string
}

const TestExamHeader: React.FC<TestExamHeaderProps> = ({ exam, timeLeft, code }) => {
  return (
    <div className="bg-slate-800 text-white p-6 border-b-4 border-indigo-500 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-indigo-100">
          Mã đề {code ?? ""}
        </h1>
        <p className="text-base text-slate-300 mb-6">
          {exam?.description ?? ""}
        </p>

        <div className="flex items-center justify-between bg-slate-700/90 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">
                Thời gian còn lại
              </span>
              <span className="text-2xl font-mono font-bold text-emerald-400 block mt-1">
                {formatTime(timeLeft ?? 0)}
              </span>
            </div>  
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-slate-400">
              Thời gian làm bài
            </div>
            <div className="text-base font-medium text-slate-200">
              {formatHumanTime(exam?.examTime ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExamHeader;
