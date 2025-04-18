import { useState } from "react";
import { ItemAnswer } from "@/utils/type";

export type AnswerClientProps = {
  answers: ItemAnswer;
  selectedOption: string;
  userAnswer?: string,
  onSelect: (id: string) => void;
  disabled?: boolean
};

export const AnswersClient = ({ answers, selectedOption, onSelect, disabled, userAnswer }: AnswerClientProps) => {
  return (
    <div className={`mt-3 py-2 border w-full rounded-md cursor-pointer 
      ${selectedOption === answers.id && disabled && 'bg-green-400'}
      ${userAnswer === answers.id && disabled ? "bg-blue-300" : ""}
    `}>
      <label className={`flex items-center gap-3 px-3 cursor-pointer `}>
        <input
          type="radio"
          value={answers.id}
          checked={selectedOption === answers.id}
          onChange={() => onSelect(answers.id)}
          disabled={disabled}
          className={`w-5 h-5`}
        />
        {answers.content}
      </label>
    </div>
  );
};
