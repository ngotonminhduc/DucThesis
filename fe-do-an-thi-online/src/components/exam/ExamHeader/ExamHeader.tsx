import { ChangeEventHandler, useEffect, useState } from "react";
import { CardExam } from "../../card/CardExam";
import { TextInput } from "../../input/TextInput";
import Dropdown from "../../userDropdown/Dropdown";
import { statusArray } from "@/utils/type";
import { Timestamp } from "../../time";
import { TExam, TExamStatus } from "@/services/examService";
import { getSecond } from "@/utils/time";
import { UpdateItemHandler } from "./type";

export interface ExamHeaderProps {
  onUpdateItem?: UpdateItemHandler;
  val?: TExam;
}

export const ExamHeader = ({ onUpdateItem, val }: ExamHeaderProps) => {
  const [topic, setTopic] = useState(val?.topic ?? "");
  const [description, setDescription] = useState(val?.description ?? "");
  const [status, setStatus] = useState<TExamStatus>(val?.status ?? "active");
  const [timestamp, setTimestamp] = useState<number>(
    val?.examTime ?? getSecond(40, "minute")
  );

  const handleChangeTopic: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTopic(e.target.value);
  };

  const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeDropdownValue = (v: string) => {
    setStatus(v as TExamStatus);
  };

  const handleChangeTimestamp = (timestamp: number) => {
    setTimestamp(timestamp);
  };

  useEffect(() => {
    onUpdateItem?.({
      topic,
      description,
      status,
      id: val?.id ?? "",
      createdAt: val?.createdAt ?? new Date(),
      examTime: timestamp,
    });
  }, [topic, description, timestamp, status]);

  return (
    <CardExam className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* Left Section - Topic and Description */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tên môn thi
            </label>
            <TextInput
              val={topic}
              onChange={handleChangeTopic}
              customStyle="w-full px-4 py-2 border rounded-lg"
              placeholder="Nhập tên môn học"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={handleChangeDescription}
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none ml-3 p-1 bg-transparent focus:border-b-2 focus:border-gray-300 focus:outline-none focus:ring-0"
              placeholder="Thêm mô tả cho kỳ thi..."
            />
          </div>
        </div>

        {/* Right Section - Settings */}
        <div className="md:w-64 lg:w-80 space-y-4">
          <Dropdown
            item={statusArray}
            defaultValue={status}
            placeHolder="Chọn trạng thái"
            onValueChange={handleChangeDropdownValue}
            className="w-full"
            label="Trạng thái đề thi"
          />
          <Timestamp
            name="examTime"
            defaultValue={timestamp}
            onTimeChange={handleChangeTimestamp}
            className="w-full"
          />
        </div>
      </div>
    </CardExam>
  );
};
