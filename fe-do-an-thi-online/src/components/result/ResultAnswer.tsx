import { TAnswer } from "@/services/answerService";
import React from "react";

interface ResultAnswerProps {
  val: TAnswer;
  isChoice: boolean
}

const ResultAnswer: React.FC<ResultAnswerProps> = ({ val, isChoice }) => {
  return (
    <div
      key={val.id}
      className={`p-2 rounded border ${
        val.isCorrect
          ? "bg-green-100 border-emerald-600"
          : isChoice
          ? "bg-red-100 border-red-600"
          : "bg-gray-50"
      }`}
    >
      {val.content}
    </div>
  );
};

export default ResultAnswer
