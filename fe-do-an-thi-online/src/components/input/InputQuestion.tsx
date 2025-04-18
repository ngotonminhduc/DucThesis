"use client";
import { ChangeEventHandler, FC, Ref, useEffect, useState } from "react";
interface InputAnswerProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  customStyle?: string;
  name: string;
  value: string;
  disabled?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export const InputQuestion: FC<InputAnswerProps> = ({
  name,
  value,
  onChange,
  customStyle,
  disabled,
  ref,
}) => {
  return (
    <div className="w-full flex justify-center">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-3xl px-4 py-2 w-full focus:outline-none focus:border-gray-500 ${customStyle}`}
        placeholder={"Nhập câu hỏi"}
        disabled={disabled}
        ref={ref}
      />
    </div>
  );
};
