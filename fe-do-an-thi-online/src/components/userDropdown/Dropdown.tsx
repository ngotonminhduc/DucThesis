"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Status } from "@/utils/type";

type DropdownProps = {
  label?: string;
  defaultValue?: string;
  placeHolder?: string;
  item: { value: string; label: string }[];
  onValueChange: (v: string) => void;
  className?: string;
}

const Dropdown = ({
  label,
  item,
  placeHolder,
  defaultValue,
  onValueChange,
  className
}: DropdownProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Select 
        defaultValue={defaultValue} 
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full h-10 px-3 py-2 text-gray-700 border rounded-lg">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-lg shadow-lg">
          {item.map((e, i) => (
            <SelectItem 
              key={i} 
              value={e.value}
              className="text-base px-4 py-2 hover:bg-gray-50 focus:bg-gray-100"
            >
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dropdown;