"use client";

import { FC, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import '@ant-design/v5-patch-for-react-19'
import { TimePicker } from "antd";
import { getSecond } from "@/utils/time";

dayjs.extend(utc);

interface TimestampProps {
  name: string;
  format?: string;
  defaultValue?: number;
  onTimeChange?: (timestamp: number) => void;
  className?: string;
}

export const Timestamp: FC<TimestampProps> = ({
  name,
  format = "HH:mm:ss",
  defaultValue,
  onTimeChange,
  className,
}) => {
  const [time, setTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (defaultValue) {
      const parsedTime = dayjs.utc().startOf("day").add(defaultValue, "second");
      setTime(parsedTime);
    }
  }, [defaultValue, format]);

  const handleTimeChange = (value: Dayjs | null) => {
    if (value) {
      const unixtimestamp =
        getSecond(value.hour(), "hour") +
        getSecond(value.minute(), "minute") +
        getSecond(value.second(), "second");
      setTime(value);
      onTimeChange?.(unixtimestamp);
    } else {
      setTime(null);
      onTimeChange?.(0);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        Thời gian thi
      </label>

      <TimePicker
        id={name}
        value={time}
        placeholder="HH:mm:ss"
        onChange={handleTimeChange}
        format={format}
        className="w-full h-10 px-3 py-2 border rounded-lg hover:border-gray-400"
        popupClassName="[&_.ant-picker-time-panel-column]:border-l-0 [&_.ant-picker-time-panel-cell]:px-4 [&_.ant-picker-time-panel-cell]:py-2"
        inputReadOnly
      />
    </div>
  );
};
