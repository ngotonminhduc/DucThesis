import React from "react";

interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checked ? "border-blue-500" : "border-gray-400"}`}
      >
        {checked && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
      </div>
      <span>{label}</span>
    </label>
  );
};