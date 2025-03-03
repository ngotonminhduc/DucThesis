"use client";
import { FC, useEffect, useState } from 'react';
interface InputAnswerProps {
  onChange?: (text: string) => void;
  placeholder?: string;
  style?: string
  name: string
  textRequired?: string
  value: string
  disabled?: boolean
}

export const InputAnswer: FC<InputAnswerProps> = ({
  name,
  value,
  onChange,
  placeholder = "Nhập văn bản...",
  style,
  disabled,
}) => {
  const [text, setText] = useState('');
  
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <input
        type="text"
        name={name}
        value={value ?? text}
        onChange={handleChange}
        className={`border rounded-3xl px-4 py-2 w-full focus:outline-none focus:border-gray-500 ${style}`}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

