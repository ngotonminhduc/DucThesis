"use client";

import { CardExam } from "@/components/card/CardExam";
import { Plus, Trash2 } from "lucide-react";
import { CheckBox } from "@/components/input/CheckBox";
import { TextInput } from "@/components/input/TextInput";
import { TQuestionType } from "@/services/questionService";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ChangeEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
} from "react";
import { SubjectAnswer } from "../SubjectAnswer/SubjectAnswer";
import {
  AddItemHandler,
  ChangeStateHandler,
  RemoveItemHandler,
  TStateSubjectAnswer,
  TStateSubjectQuestion,
  UpdateItemHandler,
} from "./type";
import { useSubjectAnswerStore } from "@/store/subject-answer-store";
import { useParams } from "next/navigation";
import { TCreateSubjectAnswer } from "@/services/subjectAnswerService";

interface SubjectQuestionProps {
  canEdit?: boolean;
  isCreate?: boolean;
  onAddItem?: AddItemHandler;
  onRemoveItem?: RemoveItemHandler;
  onUpdateItem?: UpdateItemHandler;
  onChangeState?: ChangeStateHandler;
  val?: TStateSubjectQuestion;
  incrementId?: string;
  isAddItemComponent?: boolean;
}

export const SubjectQuestion = React.memo(
  ({
    canEdit,
    isCreate,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onChangeState,
    val,
    incrementId,
    isAddItemComponent,
  }: SubjectQuestionProps) => {
    // States for the question

    const [type, setType] = useState<TQuestionType>(
      val?.type ?? "MultipleChoice"
    );
    const [answers, setAnswers] = useState<TStateSubjectAnswer[]>(
      val?.answers ?? []
    );
    const [content, setContent] = useState<string>(val?.content ?? "");
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAction, setIsAction] = useState(false);
    const { subjectAnswers: storedAnswers, getSubjectAnswers } =
      useSubjectAnswerStore();
    const params = useParams<{ id: string }>();
    const scrollBottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [answers.length]);

    const updateItem = () => {
      if (isAddItemComponent) {
        return;
      }

      const canUpdate =
        !!content &&
        (type === "Essay"
          ? true 
          : answers.length > 1 &&
            answers.some(
              (a) =>
                (typeof a.canUpdate !== "undefined" ? a.canUpdate : true) &&
                a.isCorrect &&
                !!a.content.trim()
            ));

      onUpdateItem?.(val?.id!, {
        content,
        subjectId: val?.subjectId!,
        answers,
        type,
        id: val?.id,
        canUpdate,
      });
    };

    useEffect(() => {
      updateItem();
      onChangeState?.("update");
    }, [isAction, content, type, answers]);

    useEffect(() => {
      const index = answers.findIndex((a) => a.isCorrect);
      setSelectedAnswer(index);
    }, [answers]);

    useEffect(() => {
      if (isAddItemComponent || !val?.id) {
        return;
      }
      (async () => {
        await getSubjectAnswers(val?.id!);
      })();
    }, []);

    useEffect(() => {
      setIsAction(!isAction);
    }, [answers, type, content]);

    useEffect(() => {
      if (!val) {
        return;
      }

      setAnswers(storedAnswers[val.id!] ?? answers);
    }, [storedAnswers[val?.id!]]);

    const handleChangeContent: ChangeEventHandler<HTMLInputElement> = (e) => {
      setContent(e.target.value);
    };

    const addItem = () => {
      if (!content.trim()) {
        return;
      }
      
      const questionData = {
        content,
        type,
        subjectId: val?.subjectId || params.id,
        answers,
        id: val?.id ?? "",
        canUpdate: type === "Essay" ? !!content.trim() : (!!content.trim() && answers.some(a => a.isCorrect && !!a.content.trim())),
        idx: incrementId ?? 0
      };
      
      onAddItem?.(questionData);
      
      // Reset form sau khi thêm
      setContent("");
      setAnswers([]);
      setType("MultipleChoice");
      setIsAction(!isAction);
    };

    const handleAddItem: MouseEventHandler<SVGSVGElement> = () => {
      if (!content.trim()) {
        return;
      }
      addItem();
    };

    const handleInputKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key !== "Enter" || !content.trim() || !isAddItemComponent) {
        return;
      }
      e.preventDefault();
      addItem();
    };

    const handleRemoveItem: MouseEventHandler = () => {
      if (!val) {
        return;
      }
      onRemoveItem?.(val.id!);
      onChangeState?.("delete", { key: val.id! });
    };

    const handleSelectAnswer = (answerKey: number) => {
      setSelectedAnswer(answerKey);
      const updateAnswers = answers.map((a, i) => ({
        ...a,
        isCorrect: answerKey === i,
      }));
      setAnswers(updateAnswers);
      onChangeState?.("update");
    };

    const handleAddAnswer = useCallback(
      (answer: TCreateSubjectAnswer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        if (typeof incrementId === "undefined" || !val) {
          return;
        }
      },
      [answers]
    );

    const handleUpdateAnswer = useCallback(
      (key: number, answer: TCreateSubjectAnswer) => {
        answers[key] = answer;
        setAnswers([...answers]);
      },
      [answers]
    );

    const handleRemoveAnswer = useCallback(
      (answerKey: number) => {
        setAnswers(answers.filter((_, i) => i !== answerKey));
      },
      [answers]
    );

    const handleChangeType: ChangeEventHandler<HTMLInputElement> = (e) => {
      const newType = e.target.value === "Essay" ? "MultipleChoice" : "Essay";
      
      // Nếu chuyển từ trắc nghiệm sang tự luận, lưu lại các câu trả lời trước đó
      const oldAnswers = [...answers];
      
      // Làm rỗng danh sách câu trả lời nếu chuyển sang tự luận
      if (newType === "Essay") {
        setAnswers([]);
      } else if (newType === "MultipleChoice" && oldAnswers.length === 0) {
        // Nếu chuyển từ tự luận sang trắc nghiệm và chưa có câu trả lời nào
        // Không cần làm gì thêm, SubjectAnswer sẽ cho phép thêm mới
      }
      
      setType(newType);
    };

    return (
      <CardExam className="mt-4 flex flex-col w-full">
        <div className="flex flex-col justify-start w-full">
          <div className="flex justify-center items-center">
            <div className="w-full flex justify-center">
              <TextInput
                style="border rounded-3xl px-4 py-2 w-full focus:outline-none focus:border-gray-500 rounded-md  sm:-[5rem] md:w-[12rem] lg:w-[20rem] xl:w-[33rem]"
                placeholder="Nhập câu hỏi"
                disable={!canEdit}
                val={content}
                onChange={handleChangeContent}
                onKeyDown={handleInputKeydown}
              />
            </div>
            <div className="flex justify-center items-center w-full ">
              {!isAddItemComponent ? (
                <button
                  type="button"
                  title="Xoá câu hỏi"
                  className="w-full flex justify-center items-center "
                  onClick={handleRemoveItem}
                >
                  <Trash2 className=" text-red-500 w-5" />
                </button>
              ) : (
                <div className="flex justify-center items-center w-full "></div>
              )}
              <CheckBox
                title={
                  type === "Essay"
                    ? "Chuyển câu hỏi trắc nghiệm"
                    : "Chuyển câu hỏi tự luận"
                }
                customStyle="w-10 h-5"
                checked={type === "Essay"}
                onChange={handleChangeType}
                val={type}
              />
              {isAddItemComponent ? (
                <Plus
                  onClick={handleAddItem}
                  className={`${
                    !content.trim() ? "text-gray-400" : "text-green-500"
                  } cursor-pointer`}
                  width={60}
                  height={60}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {type === "MultipleChoice" ? (
          answers.map((a, i) => (
            <SubjectAnswer
              isSelected={selectedAnswer === i}
              onSelectChange={handleSelectAnswer}
              onRemoveItem={handleRemoveAnswer}
              onUpdateItem={handleUpdateAnswer}
              incrementId={i}
              questionId={val?.id ?? ""}
              key={i}
              canEdit={canEdit}
              val={a}
            />
          ))
        ) : (
          <div className="px-4 py-2 italic text-gray-500">
            Câu hỏi tự luận không yêu cầu lựa chọn đáp án
          </div>
        )}
        <div ref={scrollBottomRef}></div>
        {isCreate && type === "Essay" ? (
          <></>
        ) : (
          <SubjectAnswer
            isAddItemComponent
            canEdit={canEdit}
            isEssay={type === "Essay"}
            questionId={val?.id ?? ""}
            onAddItem={handleAddAnswer}
          />
        )}
      </CardExam>
    );
  }
);
