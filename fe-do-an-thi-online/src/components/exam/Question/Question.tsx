import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CardExam } from "../../card/CardExam";
import { Plus, Trash2 } from "lucide-react";
import { CheckBox } from "../../input/CheckBox";
import { Answer } from "../Answer/Answer";
import { TextInput } from "../../input/TextInput";
import { TQuestionType } from "@/services/questionService";
import { TCreateAnswer } from "@/services/answerService";
import { useParams } from "next/navigation";
import { useAnswerStore } from "@/store/answer-store";
import {
  AddItemHandler,
  ChangeStateHandler,
  RemoveItemHandler,
  TStateQuestion,
  UpdateItemHandler,
} from "./type";
import { TStateAnswer } from "../Answer/type";

interface QuestionProps {
  canEdit?: boolean;
  isCreate?: boolean;
  onAddItem?: AddItemHandler;
  onRemoveItem?: RemoveItemHandler;
  onUpdateItem?: UpdateItemHandler;
  onChangeState?: ChangeStateHandler;
  val?: TStateQuestion;
  incrementId?: number;
  isAddItemComponent?: boolean;
}
const Question = React.memo(
  ({
    canEdit = false,
    val,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onChangeState,
    isAddItemComponent = false,
    isCreate = false,
    incrementId,
  }: QuestionProps) => {
    const [type, setType] = useState<TQuestionType>(
      val?.type ?? "MultipleChoice"
    );
    const [answers, setAnswers] = useState<TStateAnswer[]>(val?.answers ?? []);
    const [content, setContent] = useState<string>(val?.content ?? "");
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAction, setIsAction] = useState(false);
    const { answers: storedAnswers, getAnswers } = useAnswerStore();
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
        (type === "MultipleChoice"
          ? answers.length > 1 &&
            answers.some(
              (a) =>
                (typeof a.canUpdate !== "undefined" ? a.canUpdate : true) &&
                a.isCorrect
            )
          : true);

      onUpdateItem?.(incrementId!, {
        content,
        examId: val?.examId!,
        answers,
        type,
        id: val?.id,
        canUpdate,
        idx: incrementId!,
      });
    };

    useEffect(() => {
      updateItem();
      onChangeState?.("update");
    }, [isAction]);

    useEffect(() => {
      const index = answers.findIndex((a) => a.isCorrect);
      setSelectedAnswer(index);
    }, [answers]);

    useEffect(() => {
      if (isAddItemComponent || !val?.id) {
        return;
      }
      (async () => {
        await getAnswers(val?.id!);
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
      setContent("");
      setAnswers([]);
      setType("MultipleChoice");
      setIsAction(!isAction);
      onAddItem?.({
        content,
        type,
        examId: val?.examId || params.id,
        answers,
        id: val?.id ?? "",
        canUpdate: !!content,
        idx: incrementId!,
      });
    };

    const handleAddItem: MouseEventHandler<SVGSVGElement> = () => {
      if (!content) {
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
      onRemoveItem?.(incrementId ?? 0);
      onChangeState?.("delete", { key: incrementId! });
    };

    const handleSelectAnswer = (answerKey: number) => {
      setSelectedAnswer(answerKey);
      const updateAnswers = answers.map((a, i) => ({
        ...a,
        isCorrect: answerKey === i,
      }));
      setAnswers(updateAnswers);
    };

    const handleAddAnswer = useCallback(
      (answer: TCreateAnswer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        if (typeof incrementId === "undefined" || !val) {
          return;
        }
      },
      [answers]
    );

    const handleUpdateAnswer = useCallback(
      (key: number, answer: TCreateAnswer) => {
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
      const t = e.target.value === "Essay" ? "MultipleChoice" : "Essay";
      setType(t);
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
                  className={`text-gray-${
                    !content ? "500" : "0"
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
            <Answer
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
          <></>
        )}
        <div ref={scrollBottomRef}></div>
        {isCreate && type === "Essay" ? (
          <></>
        ) : (
          <Answer
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
export default Question;
