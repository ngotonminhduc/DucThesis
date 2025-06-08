"use client";

import { TextInput } from "@/components/input/TextInput";
import { Radio } from "@/components/input/Radio";
import { Trash2, Plus } from "lucide-react";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  ChangeEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
} from "react";
import { TStateSubjectAnswer } from "../SubjectQuestion/type";
import {
  AddItemHandler,
  RemoveItemHandler,
  SelectChangeItemHandler,
  TStateAnswer,
  UpdateItemHandler,
} from "./type";
import { useParams } from "next/navigation";

interface SubjectAnswerProps {
  canEdit?: boolean;
  isEssay?: boolean;
  isSelected?: boolean;
  onSelectChange?: SelectChangeItemHandler;
  onAddItem?: AddItemHandler;
  onChangeContent?: () => void;
  onUpdateItem?: UpdateItemHandler;
  isAddItemComponent?: boolean;
  val?: TStateAnswer;
  questionId: string;
  incrementId?: number;
  onRemoveItem?: RemoveItemHandler;
}

export const SubjectAnswer = React.memo(
  ({
    canEdit = false,
    isEssay = false,
    val,
    isSelected,
    questionId,
    onSelectChange,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    isAddItemComponent = false,
    incrementId,
  }: SubjectAnswerProps) => {
    // States for the answer
    const [content, setContent] = useState(val?.content ?? "");
    const [isCorrect, setIsCorrect] = useState(val?.isCorrect ?? false);
    const inputRef = useRef<HTMLInputElement>(null);
    const params = useParams<{ id: string }>();
    const handleChangeContent: ChangeEventHandler<HTMLInputElement> = (e) => {
      setContent(e.target.value);
    };

    useEffect(() => {
      if (isAddItemComponent) {
        return;
      }
      
      // Chỉ cập nhật khi nội dung có thay đổi để tránh vòng lặp vô hạn
      const trimmedContent = content.trim();
      onUpdateItem?.(incrementId!, {
        content: trimmedContent,
        subjectId: val?.subjectId!,
        isCorrect,
        subjectQuestionId: questionId,
        id: val?.id,
        canUpdate: !!trimmedContent, // Đảm bảo câu trả lời không trống
      });
    }, [content, isCorrect, incrementId, questionId]);

    const handleAddItem: MouseEventHandler<SVGSVGElement> = () => {
      if (!content || !content.trim()) {
        return;
      }
      setContent("");
      setIsCorrect(false);
      onAddItem?.({
        content,
        isCorrect,
        subjectId: params.id,
        subjectQuestionId: questionId,
        id: val?.id ?? "",
      });
    };
    const handleSelectChangeItem: ChangeEventHandler<HTMLInputElement> = () => {
      onSelectChange?.(incrementId ?? 0);
    };
    const handleRemoveItem = () => {
      if (!val) {
        return;
      }
      onRemoveItem?.(incrementId ?? 0);
    };

    const handleFocusInput = () => {
      inputRef.current?.focus();
    };

    const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key !== "Enter" || !content.trim() || !isAddItemComponent) {
        return;
      }
      e.preventDefault();
      
      const trimmedContent = content.trim();
      onAddItem?.({
        content: trimmedContent,
        isCorrect: !!isSelected,
        subjectId: params.id,
        subjectQuestionId: questionId,
      });
      
      setContent("");
    };

    return (
      <div>
        <div className="justify-center items-center">
          {!isEssay ? (
            <div
              className={`flex items-center flex-1 mt-5 w-10/12`}
              onClick={handleFocusInput}
            >
              {/* Radio button */}
              {!isAddItemComponent ? (
                <Radio
                  checked={!!isSelected}
                  val={incrementId}
                  onChange={handleSelectChangeItem}
                />
              ) : (
                <></>
              )}
              {/* Input text */}
              <TextInput
                ref={inputRef}
                placeholder="Nhập câu trả lời"
                val={content}
                onChange={handleChangeContent}
                onKeyDown={handleInputKeydown}
                disable={!canEdit}
              />
              {/* Xoá câu trả lời khỏi danh sách */}
              {canEdit && !isAddItemComponent ? (
                <button
                  type="button"
                  title="Xoá câu trả lời"
                  className="w-full flex justify-center items-center"
                  onClick={handleRemoveItem}
                >
                  <Trash2 className=" text-red-500 w-5" />
                </button>
              ) : (
                <div className="w-full flex justify-center items-center"></div>
              )}
              {isAddItemComponent ? (
                <Plus
                  onClick={handleAddItem}
                  className={`${
                    !content.trim() ? "text-gray-400" : "text-green-500"
                  } cursor-pointer`}
                  width={40}
                  height={40}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <TextInput
              placeholder="Nhập câu trả lời"
              val={val?.content ?? content}
              onChange={handleChangeContent}
              disable={!canEdit}
            />
          )}
        </div>
      </div>
    );
  }
);
