import { TQuestion } from "@/services/questionService";
import React, { useEffect, useState } from "react";
import { AnswerChangeHandler } from "./type";
import { TAnswer } from "@/services/answerService";
import { useAnswerStore } from "@/store/answer-store";

interface TestQuestionProps {
  val: TQuestion;
  incrementId: number;
  onAnswerChange: AnswerChangeHandler;
  onEssayAnswerChange: AnswerChangeHandler;
  studentAnswers: any[];
  examCompleted: boolean;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
  val,
  incrementId,
  studentAnswers,
  examCompleted,
  onAnswerChange,
  onEssayAnswerChange,
}) => {
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const { answers: storedAnswers, getAnswers } = useAnswerStore();

  useEffect(() => {
    (async () => {
      await getAnswers(val.id);
    })();
  }, []);

  useEffect(() => {
    if (!storedAnswers[val.id]?.length) {
      return;
    }
    setAnswers(storedAnswers[val.id]!);
  }, [storedAnswers[val.id]]);

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <div className="flex items-start mb-4">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
          {incrementId + 1}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{val.content}</h3>
      </div>

      <div className="ml-11 space-y-3">
        {val.type === "MultipleChoice" &&
          answers?.map((answer, i) => (
            <label
              key={i}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
            ${
              studentAnswers[incrementId]?.answerIds.includes(answer.id)
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-gray-100 border-2 border-transparent"
            }`}
            >
              <input
                type="radio"
                name={`question-${incrementId}`}
                className="w-5 h-5 text-blue-600"
                onChange={() => onAnswerChange(incrementId, answer.id!)}
                checked={studentAnswers[incrementId]?.answerIds.includes(
                  answer.id
                )}
                disabled={examCompleted}
              />
              <span className="ml-3 text-gray-700">{answer.content}</span>
            </label>
          ))}
        {val.type === "Essay" && (
          <textarea
            className="w-full ml-3 p-1 bg-transparent rounded-md focus:border-b-2 focus:border-gray-300 focus:outline-none focus:ring-0"
            rows={4}
            placeholder="Nhập câu trả lời của bạn..."
            value={studentAnswers[incrementId]?.answer || ""}
            onChange={(e) => onEssayAnswerChange(incrementId, e.target.value)}
            disabled={examCompleted}
          />
        )}
      </div>
    </div>
  );
};

export default TestQuestion;
