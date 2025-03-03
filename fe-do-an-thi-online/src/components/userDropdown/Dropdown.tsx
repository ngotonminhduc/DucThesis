"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Status } from "@/utils/type";


type DropdownProps = {
  label: string
  defaultValue?: string
  item: { value: Status; label: string }[]; // Dùng Array thay vì Tuple
  onValueChange:(v: Status)=> void
}

const Dropdown = ({
  label,
  item,
  defaultValue,
  onValueChange,
}:DropdownProps) => {
  const [selectedValue, setSelectedValue] = React.useState<Status | undefined>();

  return (
    <div className="flex flex-col px-5">
      <label className="">{label}</label>
      <Select value={selectedValue ?? defaultValue} onValueChange={(v: Status) =>{
        setSelectedValue(v);
        onValueChange(v);
      }}>
        <SelectTrigger className="w-[160px] h-10 text-gray-500 text-lg">
          <SelectValue 
            placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {
            item.map((e,i) => (
              <SelectItem key={i} className="text-lg" value={e.value}>{e.label}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dropdown;
