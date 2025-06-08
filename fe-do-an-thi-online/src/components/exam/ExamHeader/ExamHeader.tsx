import { ChangeEventHandler, useEffect, useState } from "react";
import { CardExam } from "../../card/CardExam";
import { TextInput } from "../../input/TextInput";
import Dropdown from "../../userDropdown/Dropdown";
import { statusArray } from "@/utils/type";
import { Timestamp } from "../../time";
import { TExam, TExamStatus } from "@/services/examService";
import { getSecond } from "@/utils/time";
import { UpdateItemHandler } from "./type";
import { SubjectSelector } from "../SubjectSelector";
import { useSubjectStore } from "@/store/subject-store";
import { NumberInput } from "@/components/input/NumberInput";
import { toast } from "react-toastify";

export interface ExamHeaderProps {
  onUpdateItem?: UpdateItemHandler;
  onSubjectSelect?: (subjectId: string) => void;
  selectedSubjectId?: string;
  disabledStatus?: boolean;
  questionLength?: number;
  val?: TExam;
}

export const ExamHeader = ({
  onUpdateItem,
  val,
  onSubjectSelect,
  selectedSubjectId,
  disabledStatus,
  questionLength = 0,
}: ExamHeaderProps) => {
  const [topic, setTopic] = useState(val?.topic ?? "");
  const [description, setDescription] = useState(val?.description ?? "");
  const [status, setStatus] = useState<TExamStatus>(val?.status ?? "pending");
  const [tagQuantity, setTagQuantity] = useState(val?.tagQuantity ?? 0);
  const [timestamp, setTimestamp] = useState<number>(
    val?.examTime ?? getSecond(40, "minute")
  );

  const handleChangeTopic: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTopic(e.target.value);
  };

  const handleChangeDescription: ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    setDescription(e.target.value);
  };

  const handleChangeDropdownValue = (v: string) => {
    setStatus(v as TExamStatus);
  };

  const handleChangeTimestamp = (timestamp: number) => {
    setTimestamp(timestamp);
  };

  useEffect(() => {
    if (questionLength < tagQuantity) {
      setTagQuantity(questionLength);
    }
  }, [questionLength]);

  useEffect(() => {
    onUpdateItem?.({
      topic,
      description,
      status,
      id: val?.id ?? "",
      createdAt: val?.createdAt ?? new Date(),
      subjectId: val?.subjectId ?? selectedSubjectId ?? "",
      examTime: timestamp,
      tagQuantity,
    });
  }, [topic, description, timestamp, status, tagQuantity]);

  const { subjects } = useSubjectStore();

  const handleChangeTagQuantity: ChangeEventHandler<HTMLInputElement> = (e) => {
    const n = parseInt(e.target.value || "0");
    if (n > questionLength) {
      return;
    }
    setTagQuantity(n);
  };

  return (
    <CardExam className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* Left Section - Topic and Description */}
        <div className="flex-1 space-y-4">
          {!!onSubjectSelect ? (
            <SubjectSelector
              onSubjectSelect={onSubjectSelect}
              selectedSubjectId={selectedSubjectId || val?.subjectId}
            />
          ) : (
            <div className="w-full text-blue-700 text-lg font-medium">
              Ngân hàng đề môn {subjects.get(val?.subjectId ?? "")?.title}
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Chủ đề bài thi
            </label>
            <TextInput
              val={topic}
              onChange={handleChangeTopic}
              disable={!onSubjectSelect}
              customStyle="w-full px-4 py-2 border rounded-lg"
              placeholder="Thêm chủ đề cho bài thi"
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
              placeholder="Thêm mô tả cho bài thi..."
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
            label="Trạng thái bài thi"
            disabled={disabledStatus}
          />
          <Timestamp
            name="examTime"
            defaultValue={timestamp}
            onTimeChange={handleChangeTimestamp}
            className="w-full"
          />
          {!onSubjectSelect ? <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Mã đề
            </label>
            <NumberInput
              placeholder="Nhập số lượng"
              min={0}
              max={questionLength ?? 100}
              step={1}
              val={tagQuantity}
              customStyle="w-full px-4 py-2 border rounded-lg"
              onChange={handleChangeTagQuantity}
            />
          </div> : <></>}
        </div>
      </div>
    </CardExam>
  );
};
