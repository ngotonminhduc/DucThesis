"use client";

import { CardExam } from "@/components/card/CardExam";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ExamHeader } from "@/components/exam/ExamHeader/ExamHeader";
import { useExamStore } from "@/store/exam-store";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/effect/Spinner";
import { Button } from "@/components/button/Button";
import { useQuestionStore } from "@/store/question-store";
import Question from "@/components/exam/Question/Question";
import { useAnswerStore } from "@/store/answer-store";
import { TCreateAnswer } from "@/services/answerService";
import {
  AddItemHandler,
  ChangeStateHandler,
  RemoveItemHandler,
  TStateQuestion,
  UpdateItemHandler,
} from "@/components/exam/Question/type";
import { UpdateItemHandler as UpdateExamHandler } from "@/components/exam/ExamHeader/type";
import { TExam } from "@/services/examService";

function DetailExamPage() {
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { updateExam, detailExam, exams, error, isLoading, clearError } =
    useExamStore();
  const [questions, setQuestions] = useState<TStateQuestion[]>([]);
  const {
    getQuestions,
    error: questionError,
    questions: storedQuestions,
    isLoading: isQuestionLoading,
    deleteAllQuestions,
    createQuestion,
    clearError: clearQuestionError,
  } = useQuestionStore();

  const { createAnswers, deleteAllAnswers } = useAnswerStore();

  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const [exam, setExam] = useState<TExam>();

  useEffect(() => {
    (async () => {
      await detailExam(params.id);
      await getQuestions(params.id);
    })();
  }, []);

  useEffect(() => {
    if (!exams.get(params.id)) {
      return;
    }
    setExam(exams.get(params.id));
  }, [exams.get(params.id)]);

  useEffect(() => {
    setQuestions(storedQuestions[params.id] ?? []);
  }, [storedQuestions.length]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isQuestionLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  useEffect(() => {
    if (questionError) {
      toast.error(questionError);
      clearQuestionError();
    }
  }, [questionError]);

  const handleUpdateExamState: UpdateExamHandler = useCallback((data) => {
    setExam(data);
    setCanUpdate(!!data.topic && !!data.description && data.examTime > 0);
  }, []);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = async () => {
    router.push("/admin/dashboard");
  };

  const handleUpdatequestion: UpdateItemHandler = useCallback(
    (key, question) => {
      questions[key] = question;
      setQuestions([...questions]);
    },
    [questions]
  );

  const handleUpdateExam: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!exam) {
      return;
    }
    const { id, ...exm } = exam;
    await updateExam(id, exm);
    await deleteAllQuestions(params.id);
    await deleteAllAnswers(params.id);
    const bulkAnswers = await questions.reduce(async (prev, cur) => {
      const { answers: ads, ...qd } = cur;
      const nq = await createQuestion(qd);
      const d = await prev;
      const a =
        qd.type === "Essay"
          ? []
          : (ads
              ?.map(({ id, ...a }) => ({ ...a, questionId: nq?.id! }))
              .filter(Boolean) as TCreateAnswer[] | undefined) ?? [];
      return [...d, ...a];
    }, Promise.resolve<TCreateAnswer[]>([]));
    if (bulkAnswers.length) {
      await createAnswers(bulkAnswers);
    }
    router.push("/admin/dashboard");
  };

  const handleCheckCanUpdate: ChangeStateHandler = useCallback(
    (reason, data) => {
      let qs = questions;
      switch (reason) {
        case "add":
          break;
        case "update":
          break;
        case "delete":
          if (!data) {
            return;
          }
          qs = questions.filter((_, i) => i !== data.key);
          break;
        default:
          break;
      }
      const can =
        !!exam?.topic &&
        !!exam?.examTime &&
        !!exam?.description &&
        qs.every((q) => q.canUpdate);
      setCanUpdate(can);
    },
    [questions]
  );

  const handleAddQuestion: AddItemHandler = (question) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveQuestion: RemoveItemHandler = useCallback(
    (key) => {
      setQuestions(questions.filter((_, i) => i !== key));
    },
    [questions]
  );

  useEffect(() => {
    scrollBottomRef.current;
  }, [questions]);

  return (
    <>
      {!isLoading ? (
        <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
          <ExamHeader onUpdateItem={handleUpdateExamState} val={exam} />
          {questions.map((q, i) => {
            return (
              <Question
                onRemoveItem={handleRemoveQuestion}
                onUpdateItem={handleUpdatequestion}
                onChangeState={handleCheckCanUpdate}
                isCreate
                canEdit
                key={i}
                incrementId={i}
                val={q}
              />
            );
          })}
          <Question
            isAddItemComponent
            onAddItem={handleAddQuestion}
            canEdit
            isCreate
          />
          <div className="w-full flex justify-between p-2">
            <Button
              customStyle={`order-first cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm p-2 text-center w-24  text-gray-50`}
              text="Huỷ"
              onClick={handleCancel}
            />
            <Button
              customStyle={`order-first ${
                canUpdate
                  ? "cursor-pointer bg-green-500 hover:bg-green-600"
                  : "cursor-not-allowed bg-gray-400"
              } rounded-sm p-2 text-center w-24 text-gray-50`}
              text="Cập nhật"
              onClick={handleUpdateExam}
            />
          </div>
        </CardExam>
      ) : (
        <Spinner />
      )}
      <div ref={scrollBottomRef}></div>
    </>
  );
}

export default React.memo(DetailExamPage);
