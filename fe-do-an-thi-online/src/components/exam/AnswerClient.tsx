import { useState } from "react";
import { ItemAnswer } from "@/utils/type";

export type AnswerClientProps = {
  answers: ItemAnswer;
  selectedOption: string;
  onSelect: (id: string) => void;
};

export const AnswersClient = ({ answers, selectedOption, onSelect }: AnswerClientProps) => {
  return (
    <div className="mt-3 py-2 border w-full rounded-md cursor-pointer">
      <label className="flex items-center gap-3 px-3 cursor-pointer">
        {/* Input ẩn (radio button) */}
        <input
          type="radio"
          value={answers.id}
          checked={selectedOption === answers.id}
          onChange={() => onSelect(answers.id)}
          className="w-5 h-5 ml-3"
        />

        {/* Custom UI giống checkbox */}
        {/* <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            selectedOption === answers.id ? "bg-blue-500 border-blue-500" : "border-gray-400"
          }`}
        >
          {selectedOption === answers.id && (
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          )}
        </div> */}

        {answers.content}
      </label>
    </div>
  );
};
