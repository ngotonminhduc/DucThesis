import { FC, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { TimePicker, Tooltip } from "antd";
import { getSecond } from "@/utils/time";

dayjs.extend(utc); // Kích hoạt plugin UTC

interface TimestampProps {
  name: string;
  format?: string;
  defaultValue?: string;
  onTimeChange?: (timestamp: number) => void;
}

export const Timestamp: FC<TimestampProps> = ({ 
  name,
  format = "HH:mm:ss",
  defaultValue,
  onTimeChange,
}) => {
  // const [time, setTime] = useState<Dayjs | null>(defaultValue ? dayjs(defaultValue, format).local() : null);
  const [time, setTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (defaultValue) {
      const parsedTime = dayjs.utc().startOf("day").add(Number(defaultValue), "second");
      setTime(parsedTime);

    }
  }, [defaultValue, format]);


  const handleTimeChange = (value: Dayjs | null) => {
    if (value) {
      const unixtimestamp = getSecond(value.hour(),'hour') +  getSecond(value.minute(),'minute') +  getSecond(value.second(),'second')
      setTime(value);
      onTimeChange?.(unixtimestamp);
    } else {
      setTime(null);
      onTimeChange?.(0);
    }
  };

  return (
    <Tooltip title={time ? time.format(format) : "Chọn thời gian"} className="min-w-32 flex flex-col">
      <label htmlFor={name}>Thời Gian</label>
      <TimePicker
        className="h-10"
        value={time}
        placeholder="Giờ:phút:giây"
        onChange={handleTimeChange}
        format={format}
      />
    </Tooltip>
  );
};
