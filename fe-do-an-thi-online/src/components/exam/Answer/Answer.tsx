import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Radio } from "../../input/Radio";
import { Plus, Trash2 } from "lucide-react";
import { TextInput } from "../../input/TextInput";
import { useParams } from "next/navigation";
import {
  AddItemHandler,
  RemoveItemHandler,
  SelectChangeItemHandler,
  TStateAnswer,
  UpdateItemHandler,
} from "./type";
import { useSubjectAnswerStore } from "@/store/subject-answer-store";

interface AnswerProps {
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
export const Answer = React.memo(
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
  }: AnswerProps) => {
    const [content, setContent] = useState(val?.content ?? "");
    const [isCorrect, setIsCorrect] = useState(val?.isCorrect ?? false);
    const inputRef = useRef<HTMLInputElement>(null);
    const params = useParams<{ id: string }>();
    const handleChangeContent: ChangeEventHandler<HTMLInputElement> = (e) => {
      setContent(e.target.value);
    };
    const {subjectAnswers} = useSubjectAnswerStore()

    useEffect(() => {
      if (isAddItemComponent) {
        return;
      }
      onUpdateItem?.(incrementId!, {
        content,
        examId: val?.examId!,
        isCorrect,
        questionId,
        id: val?.id,
        idx: incrementId!,
        canUpdate: !!content,
        subjectAnswerId: ''
      });
    }, [content, isCorrect]);

    const handleAddItem: MouseEventHandler<SVGSVGElement> = () => {
      if (!content) {
        return;
      }
      setContent("");
      setIsCorrect(false);
      onAddItem?.({
        content,
        isCorrect,
        examId: params.id,
        questionId,
        id: val?.id ?? "",
        idx: incrementId!,
        subjectAnswerId: ''
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
      setContent("");

      onAddItem?.({
        content,
        isCorrect: !!isSelected,
        examId: params.id,
        questionId,
        idx: incrementId!,
        subjectAnswerId: '',
      });
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
                  className={`text-gray-${
                    !content ? "500" : "0"
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
