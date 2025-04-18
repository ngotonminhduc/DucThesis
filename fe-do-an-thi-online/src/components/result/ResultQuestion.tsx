import { TQuestion } from "@/services/questionService";
import { useAnswerStore } from "@/store/answer-store";
import React, { useEffect, useState } from "react";
import ResultAnswer from "./ResultAnswer";
import { TAnswerMap } from "@/services/testService";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { TAnswer } from "@/services/answerService";
import { cn } from "@/lib/utils";

interface ResultQuestionProps {
  val: TQuestion;
  incrementId: number;
  answerChoiceIds: string[];
  correctAnswerIds: string[];
  isCorrect: boolean;
  userEssayAnswer?: string;
  className?: string;
}

const ResultQuestion: React.FC<ResultQuestionProps> = ({
  val,
  answerChoiceIds,
  incrementId,
  isCorrect,
  userEssayAnswer,
  className,
}) => {
  const { answers: storedAnswers, getAnswers } = useAnswerStore();
  const [answers, setAnswers] = useState<TAnswer[]>([]);

  useEffect(() => {
    (async () => {
      await getAnswers(val.id);
    })();
  }, []);

  useEffect(() => {
    if (!storedAnswers[val.id]?.length) return;
    setAnswers(storedAnswers[val.id]!);
  }, [storedAnswers[val.id]]);

  const isEssayQuestion = val.type === "Essay";

  return (
    <div
      className={cn(
        "rounded-lg p-4 border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {isEssayQuestion ? (
            <FileText className="w-5 h-5 text-indigo-600" />
          ) : isCorrect ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-slate-800">
              Câu {incrementId + 1}: {val.content}
            </h3>
            {!isEssayQuestion && (
              <div className="text-sm text-slate-500">
                {isCorrect
                  ? "Đã trả lời đúng"
                  : !answerChoiceIds.length
                  ? "Bạn chưa chọn đáp án"
                  : "Câu trả lời chưa chính xác"}
              </div>
            )}
          </div>
          {isEssayQuestion ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-600">
                <h4 className="text-sm font-medium text-amber-800 mb-2">
                  Bài làm của bạn:
                </h4>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {userEssayAnswer || "Không có câu trả lời"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {answers?.map((answer, i) => {
                const isSelected = answerChoiceIds.includes(answer.id);

                return (
                  <ResultAnswer key={i} val={answer} isChoice={isSelected} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultQuestion;
